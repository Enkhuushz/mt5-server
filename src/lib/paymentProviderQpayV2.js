require('dotenv').config();
const axios = require('axios');
const moment = require('moment-timezone');


let authObj = {};
const {
  BASE_URL,
  QPAY_V2_URL,
  QPAY_USERNAME,
  QPAY_PASSWORD,
  QPAY_INVOICE_CODE,
} = process.env;

async function auth() {
  const URL = `${QPAY_V2_URL}/auth/token`;
  const auth = { username: QPAY_USERNAME, password: QPAY_PASSWORD };
  const response = await axios.post(URL, { withCredentials: true }, { auth });

  authObj = response.data;

  return authObj;
}

async function getToken() {
  if (authObj) {
    const { expires_in, access_token } = authObj;
    const isValid = moment(expires_in).isAfter(moment());
    if (isValid) {
      return access_token;
    }
  }
  const resp = await auth();

  return resp.access_token;
}

async function getAuthHeader() {
  const token = await getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function generate(transactionData) {
  const {
    amount, invoiceNo, expireAt,
  } = transactionData;

  const invoiceDueDate = expireAt ? moment(expireAt).tz('Asia/Ulaanbaatar').format('YYYY-MM-DD HH:mm:ss') : null;

  const URL = `${QPAY_V2_URL}/invoice`;
  const CALLBACK_URL = `${BASE_URL}/api/payment/checkQpayV2/${invoiceNo}`;
  const body = {
    invoice_code: QPAY_INVOICE_CODE,
    sender_invoice_no: invoiceNo,
    invoice_receiver_code: 'terminal',
    invoice_description: `MOTFX challange ${amount} төлбөр`,
    invoice_due_date: invoiceDueDate, // FIX ME its not working
    amount,
    callback_url: CALLBACK_URL,
  };

  const headers = await getAuthHeader();

  const response = await axios.post(URL, body, { headers });
  const invoiceData = response.data;
  return {
    providerInvoiceNo: invoiceData.invoice_id,
    ...invoiceData,
  };
}

/**
 * Adds two numbers together.
 * @param {object} invoiceData - { amount, providerInvoiceNo }
 * @returns {object} - if code == error : not successful else: successful
 */

async function verify( invoiceData ) {
  const URL = `${QPAY_V2_URL}/payment/check`;
  const body = {
    object_type: 'INVOICE',
    object_id: invoiceData.providerInvoiceNo,
    offset: {
      page_number: 1,
      page_limit: 100,
    },
  };
  const headers = await getAuthHeader();
  const response = await axios.post(URL, body, { headers });
  const paymentData = response.data;

  const { count, paid_amount, rows } = paymentData;
  const isPaid = Math.round(invoiceData.amount) === paid_amount;
  const payment_status = isPaid ? 'PAID' : 'UNPAID';

  const msg = {
    code: 'error',
    desc: 'Unknown error',
    providerResponseCode: payment_status,
    providerResponseDesc: JSON.stringify(paymentData),
  };

  if (payment_status === 'PAID') {
    msg.code = 'success';
    msg.desc = '';
    msg.amount = paid_amount;
    return msg;
  }

  return msg;
}

module.exports = {
  generate,
  verify,
}