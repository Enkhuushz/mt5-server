const generateFunds = async (
  amount,
  lottery,
  receiptId,
  qrCode,
  date,
  dateFrom,
  dateTo,
  tax,
  totalAmount
) => {
  const html = `
    <!DOCTYPE html>
    <html
      lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <meta charset="utf-8" />
        <!-- utf-8 works for most cases -->
        <meta name="viewport" content="width=device-width" />
        <!-- Forcing initial-scale shouldn't be necessary -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <!-- Use the latest (edge) version of IE rendering engine -->
        <meta name="x-apple-disable-message-reformatting" />
        <!-- Disable auto-scale in iOS 10 Mail entirely -->
        <title></title>
        <!-- The title tag shows in email notifications, like Android 4.4. -->
        <link
          href="https://fonts.googleapis.com/css?family=Lato:300,400,700"
          rel="stylesheet"
        />
        <!-- CSS Reset : BEGIN -->
        <style>
          /* What it does: Remove spaces around the email design added by some email clients. */
          /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
          html,
          body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            background: #f1f1f1;
          }
    
          /* What it does: Stops email clients resizing small text. */
          * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
          }
    
          /* What it does: Centers email on Android 4.4 */
          div[style*="margin: 16px 0"] {
            margin: 0 !important;
          }
    
          /* What it does: Stops Outlook from adding extra spacing to tables. */
          table,
          td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
          }
    
          /* What it does: Fixes webkit padding issue. */
          table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
          }
    
          /* What it does: Uses a better rendering method when resizing images in IE. */
          img {
            -ms-interpolation-mode: bicubic;
          }
    
          /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
          a {
            text-decoration: none;
          }
    
          /* What it does: A work-around for email clients meddling in triggered links. */
          *[x-apple-data-detectors],
              /* iOS */
              .unstyle-auto-detected-links *,
              .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
    
          /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
          .a6S {
            display: none !important;
            opacity: 0.01 !important;
          }
    
          /* What it does: Prevents Gmail from changing the text color in conversation threads. */
          .im {
            color: inherit !important;
          }
    
          /* If the above doesn't work, add a .g-img class to any image in question. */
          img.g-img + div {
            display: none !important;
          }
    
          /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
          /* Create one of these media queries for each additional viewport size you'd like to fix */
          /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
          @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u ~ div .email-container {
              min-width: 320px !important;
            }
          }
    
          /* iPhone 6, 6S, 7, 8, and X */
          @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u ~ div .email-container {
              min-width: 375px !important;
            }
          }
    
          /* iPhone 6+, 7+, and 8+ */
          @media only screen and (min-device-width: 414px) {
            u ~ div .email-container {
              min-width: 414px !important;
            }
          }
        </style>
        <!-- CSS Reset : END -->
        <!-- Progressive Enhancements : BEGIN -->
        <style>
          .primary {
            background: #30e3ca;
          }
    
          .bg_white {
            background: #ffffff;
          }
    
          .bg_light {
            background: #fafafa;
          }
    
          .bg_black {
            background: #000000;
          }
    
          .bg_dark {
            background: rgba(0, 0, 0, 0.8);
          }
          /*BUTTON*/
          .btn {
            padding: 10px 15px;
            display: inline-block;
          }
    
          .btn.btn-primary {
            border-radius: 5px;
            background: #30e3ca;
            color: #ffffff;
          }
    
          .btn.btn-white {
            border-radius: 5px;
            background: #ffffff;
            color: #000000;
          }
    
          .btn.btn-white-outline {
            border-radius: 5px;
            background: transparent;
            border: 1px solid #fff;
            color: #fff;
          }
    
          .btn.btn-black-outline {
            border-radius: 0px;
            background: transparent;
            border: 2px solid #000;
            color: #000;
            font-weight: 700;
          }
    
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-family: "Lato", sans-serif;
            color: #000000;
            margin-top: 0;
            font-weight: 400;
          }
    
          body {
            font-family: "Lato", sans-serif;
            font-weight: 400;
            font-size: 15px;
            line-height: 1.8;
            color: rgba(0, 0, 0, 0.4);
          }
    
          a {
            color: #30e3ca;
          }
    
          /*HERO*/
          .hero {
            position: relative;
            z-index: 0;
          }
    
          .hero .text {
            color: rgba(0, 0, 0, 0.3);
          }
    
          .hero .text h2 {
            color: #000;
            font-size: 40px;
            margin-bottom: 0;
            font-weight: 400;
            line-height: 1.4;
          }
    
          .hero .text h3 {
            font-size: 24px;
            font-weight: 300;
          }
    
          .hero .text h2 span {
            font-weight: 600;
            color: #30e3ca;
          }
    
          .heading-section h2 {
            color: #000000;
            font-size: 28px;
            margin-top: 0;
            line-height: 1.4;
            font-weight: 400;
          }
    
          .heading-section .subheading {
            margin-bottom: 20px !important;
            display: inline-block;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(0, 0, 0, 0.4);
            position: relative;
          }
    
          .heading-section .subheading::after {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -10px;
            content: "";
            width: 100%;
            height: 2px;
            margin: 0 auto;
          }
    
          .heading-section-white {
            color: rgba(255, 255, 255, 0.8);
          }
    
          .heading-section-white h2 {
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1;
            padding-bottom: 0;
          }
    
          .heading-section-white h2 {
            color: #ffffff;
          }
    
          .heading-section-white .subheading {
            margin-bottom: 0;
            display: inline-block;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.4);
          }
    
          ul.social {
            padding: 0;
          }
    
          ul.social li {
            display: inline-block;
            margin-right: 10px;
          }
    
          /*FOOTER*/
          .footer {
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            color: rgba(0, 0, 0, 0.5);
          }
    
          .footer .heading {
            color: #000;
            font-size: 20px;
          }
    
          .footer ul {
            margin: 0;
            padding: 0;
          }
    
          .footer ul li {
            list-style: none;
            margin-bottom: 10px;
          }
    
          .footer ul li a {
            color: rgba(0, 0, 0, 1);
          }
    
          .template-header {
            margin-top: 60px;
            padding: 30px 50px 30px 50px;
            flex-direction: row;
            border-top-left-radius: 25px;
            border-top-right-radius: 25px;
            background-color: white;
            border-bottom: 1px solid #d9d9d9;
          }
    
          .left-image-content {
            width: 40%;
            overflow: hidden;
          }
    
          .left-image-content img {
            width: 200px;
            height: 50px;
            z-index: 10;
          }
    
          .footer-container {
            display: flex;
            flex-direction: row;
            padding-left: 20px;
          }
    
          .footer-left-side {
            width: 65%;
            padding-top: 20px;
            z-index: 10;
          }
    
          .footer-left-side span {
            font-size: 12px;
            color: #191919;
          }
    
          .footer-left-side ul li {
            margin: 0;
            margin-bottom: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
    
          .footer-right-side {
            width: 35%;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
          }
    
          .footer-right-side ul {
            display: flex;
            flex-direction: row;
            height: 35px;
            margin-right: 15px;
          }
          .footer-right-side ul li {
            margin-right: 5px;
          }
          .flex-container {
            display: flex;
            justify-content: space-between !important;
            }
          @media screen and (max-width: 450px) {
            .template-header {
              padding: 15px 0;
              justify-content: center;
              padding-left: 0px;
            }
    
            .left-image-content img {
              width: 150px;
              height: 40px;
              z-index: 10;
            }
    
            .right-image-content {
              display: none;
            }
    
            .left-image-content {
              width: 70%;
            }
    
            .footer-right-side img {
              display: none;
            }
          }
        </style>
      </head>
      <body
        width="100%"
        style="
          margin: 0;
          padding: 0 !important;
          mso-line-height-rule: exactly;
          background-color: #f1f1f1;
        "
      >
        <center style="width: 100%; background-color: #f1f1f1">
          <div
            style="
              display: none;
              font-size: 1px;
              max-height: 0px;
              max-width: 0px;
              opacity: 0;
              overflow: hidden;
              mso-hide: all;
              font-family: sans-serif;
            "
          >
            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
          </div>
          <div style="max-width: 600px; margin: 0 auto" class="email-container">
            <!-- BEGIN BODY -->
            <table
              align="center"
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              border="0"
              width="100%"
              style="margin: auto"
            >
              <tr>
                <div class="template-header">
                  <div class="left-image-content">
                    <img
                      src="https://portal.motforex.com/static-files/120/MOTFX%20horizontal%20%20logo%20-%20Dark_gOebmFx.png"
                      alt="MotfundsLogo"
                    />
                  </div>
                  <!-- <div class="right-image-content">
                      <img src="https://portal.motforex.com/static-files/120/effectLong.png" alt="mailEffect" />
                    </div> -->
                </div>
              </tr>
              <!-- end tr -->
              <tr>
                <td
                  valign="middle"
                  class="hero bg_white"
                  style="padding: 2em 0 4em 0"
                >
                <div
                class="text"
                style="padding: 0 2.5em; text-align: left; color: black; flex: auto;"
              >
              <p> Сайн байна уу ? 
                <br />
                <br />
                Танд энэ өдрийн мэнд хүргэе. Таны ${dateFrom} - ${dateTo}-ийн бүтээгдэхүүн, үйлчилгээний шимтгэл, хураамжийн и-баримтыг илгээж байна.
                  <br />
                  <br />
                  <table width="98%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="text-align: left; width: 50%">
                        <span class="label" style="font-size: 14px"
                          >ТТД:</span
                        >
                      </td>
                      <td style="text-align: right; width: 50%">
                        <span
                          class="value"
                          style="font-size: 14px; font-weight: bold"
                          >6960332</span
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: left; width: 50%">
                        <span class="label" style="font-size: 14px"
                          >ДДТД:</span
                        >
                      </td>
                      <td style="text-align: right; width: 50%">
                        <span
                          class="value"
                          style="font-size: 14px; font-weight: bold"
                          >${receiptId}</span
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: left; width: 50%">
                        <span class="label" style="font-size: 14px"
                          >Гүйлгээний огноо:</span
                        >
                      </td>
                      <td style="text-align: right; width: 50%">
                        <span
                          class="value"
                          style="font-size: 14px; font-weight: bold"
                          >${date}</span
                        >
                      </td>
                    </tr>
                    <!-- <tr>
                      <td style="text-align: left; width: 50%">
                        <span class="label" style="font-size: 14px"
                          >Мөнгөн дүн:</span
                        >
                      </td>
                      <td style="text-align: right; width: 50%">
                        <span
                          class="value"
                          style="font-size: 14px; font-weight: bold"
                          >${amount}</span
                        >
                      </td>
                    </tr> -->
                    <!-- <tr>
                      <td style="text-align: left; width: 50%">
                        <span class="label" style="font-size: 12px"
                          >Нийт мөнгөн дүн:</span
                        >
                      </td>
                      <td style="text-align: right; width: 50%">
                        <span
                          class="value"
                          style="font-size: 12px; font-weight: bold"
                          >${amount}</span
                        >
                      </td>
                    </tr> -->
                  </table>
                  <br />
                  <hr style="border-style:solid; border-color: grey; border-width: 1px;">
  
                  <table width="98%" cellspacing="0" cellpadding="0">
                      <tr>
                          <td style="text-align: center; width: 25%"> <span class="label" style="font-size: 14px; font-weight: bold" 
                          >№</span></td>
                          <td style="text-align: center; width: 60%"> <span class="label" style="font-size: 14px; font-weight: bold" 
                          >Бараа</span></td>
                          <td style="text-align: center; width: 50%"><span class="label" style="font-size: 14px; font-weight: bold" 
                          >т/ш</span></td>
                          <td style="text-align: center; width: 40%"> <span class="label" style="font-size: 14px; font-weight: bold" 
                          >үнэ</span></td>
                          <td style="text-align: center; width: 30%"> <span class="label" style="font-size: 14px; font-weight: bold" 
                          >Дүн</span></td>
                      </tr>
                  </table>
                  <hr style="border-style:solid; border-color: grey; border-width: 1px;">
  
                  <table width="98%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="text-align: center; width: 25%"> <span class="label" style="font-size: 14px" 
                        >1</span></td>
                        <td style="text-align: center; width: 60%"> <span class="label" style="font-size: 12px" 
                        >oн-лайн үйлчилгээ</span></td>
                        <td style="text-align: center; width: 50%"><span class="label" style="font-size: 14px" 
                        >1 </span></td>
                        <td style="text-align: center; width: 40%"> <span class="label" style="font-size: 14px" 
                        >${amount}</span></td>
                        <td style="text-align: center; width: 30%"> <span class="label" style="font-size: 14px" 
                        >${amount}</span></td>
                </tr>
              </table>
                
  
                  <!-- <table width="98%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="text-align: left; width: 50%">
                        <span class="label" style="font-size: 14px"
                          >Нийт мөнгөн дүн:</span
                        >
                      </td>
                      <td style="text-align: right; width: 50%">
                        <span
                          class="value"
                          style="font-size: 14px; font-weight: bold"
                          >${amount}</span
                        >
                      </td>
                    </tr>
                  </table> -->
                  <!-- <div class="flex-container" style="display: flex; justify-content: space-between;">
                      <span class="label" style="font-weight: bold">Нийт мөнгөн дүн:</span>
                      <span class="value" style="font-weight: bold">${amount}</span>
                  </div> -->
                  <hr style="border-style:solid; border-color: grey; border-width: 1px;">
                  <table>
                    <tr>
                      <td style="text-align: left; width: 10%"> <span class="label" style="font-size: 14px" 
                        >Нийт үнэ: </span></td>
                        <td style="text-align: left; width: 20%"> <span class="label" style="font-size: 14px; font-weight: bold" 
                          >${totalAmount} </span></td>
                        <td style="text-align: left; width: 10%"> <span class="label" style="font-size: 14px" 
                          >НХАТ: </span></td>
                          <td style="text-align: left; width: 10%"> <span class="label" style="font-size: 14px; font-weight: bold" 
                            >0.0 </span></td>
                    </tr>
                    <tr>
                      <td style="text-align: left; width: 10%"> <span class="label" style="font-size: 14px" 
                        >НӨАТ: </span></td>
                        <td style="text-align: left; width: 20%"> <span class="label" style="font-size: 14px; font-weight: bold" 
                          >${tax} </span></td>
                        <td style="text-align: left; width: 10%"> <span class="label" style="font-size: 14px" 
                          >Бүгд үнэ: </span></td>
                          <td style="text-align: left; width: 10%"> <span class="label" style="font-size: 14px; font-weight: bold" 
                            >${amount} </span></td>
                    </tr>
                  </table>
  
                  <hr style="border-style:solid; border-color: grey; border-width: 1px;">
  
                  
                  <table width="98%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="text-align: left; width: 50%">
                        <span class="label" style="font-size: 14px"
                          >Сугалааны №:</span
                        >
                      </td>
                      <td style="text-align: right; width: 50%">
                        <span
                          class="value"
                          style="font-size: 14px; font-weight: bold"
                          >${lottery}</span
                        >
                      </td>
                    </tr>
                    <tr>
                        <td style="text-align: left; width: 50%">
                          <span class="label" style="font-size: 14px"
                            >Бүртгүүлэх дүн:</span
                          >
                        </td>
                        <td style="text-align: right; width: 50%">
                          <span
                            class="value"
                            style="font-size: 14px; font-weight: bold"
                            >${amount}</span
                          >
                        </td>
                      </tr>
                  </table>
                  <!-- <div class="flex-container" style="display: flex; justify-content: space-between;">
                      <span class="label" style="font-weight: bold">Сугалааны код:</span>
                      <span class="value" style="font-weight: bold">${lottery} </span>
                  </div>
                  <br />
                  <div class="flex-container" style="display: flex; justify-content: space-between;">
                      <span class="label" style="font-size: 12px">Ebarimt.mn сайтад бүртгүүлэх дүн:</span>
                      <span class="value" style="font-weight: bold">${amount}</span>
                  </div> -->
                </p>
                <div style="text-align: center;">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}"
                    width="300"
                    height="300"
                  />
                </div>
                <br />
    
                Биднийг сонгон үйлчлүүлдэг арилжаач танд баярлалаа.
                <br />
                <p>
                  Таны амжилт, Бидний амжилт !
                  <br />
                  <br />
                  MOT FUNDS
                </p>
              </div>
                </td>
              </tr>
              <!-- end tr -->
              <!-- 1 Column Text + Button : END -->
            </table>
            <table
              align="center"
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              border="0"
              width="100%"
              style="margin-bottom: 60px"
            >
              <tr>
                <td
                  valign="middle"
                  class="bg_light footer email-section"
                  style="
                    border-bottom-left-radius: 25px;
                    border-bottom-right-radius: 25px;
                    margin-bottom: 60px;
                  "
                >
                  <div class="footer-container">
                    <div class="footer-left-side">
                      <ul>
                        <li>
                          <img
                            src="https://portal.motforex.com/static-files/120/orangeMobileIcon.png"
                            alt="icon"
                            style="height: 17px"
                          />
                          <span style="margin-left: 10px">+976 7222 2200</span>
                        </li>
                        <li>
                          <img
                            src="https://portal.motforex.com/static-files/120/orangeNotficationIcon.png"
                            alt="icon"
                            style="height: 16px"
                          />
                          <span style="padding-left: 10px"
                            >https://www.motfunds.com/</span
                          >
                        </li>
                        <li style="align-items: flex-start">
                          <img
                            src="https://portal.motforex.com/static-files/120/orangeLocationIcon.png"
                            alt="icon"
                            style="height: 17px"
                          />
                          <span style="padding-left: 10px; margin-top: -3px">
                            Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо, Жамъяан
                             гүний гудамж 18/1, "The DownTown" 4-р давхар 401
                          </span>
                        </li>
                        <li
                          style="
                            display: flex;
                            flex-direction: row;
                            align-items: flex-start;
                          "
                        ></li>
                      </ul>
                    </div>
                    <div class="footer-right-side">
                      <ul>
                        <li>
                          <a href="https://www.facebook.com/motfxofficial">
                            <img
                              src="https://portal.motforex.com/static-files/120/darkFacebookIcon.png"
                              alt="Icon"
                              style="height: 20px; width: 20px"
                            />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.instagram.com/motfxofficial/">
                            <img
                              src="https://portal.motforex.com/static-files/120/darkInstagramIcon.png"
                              alt="Icon"
                              style="height: 20px; width: 20px"
                            />
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://t.me/+blQ9UVTHbFE3MWM1?fbclid=IwAR3cWsf5nke8umcxdnEwewf8YKrdOgf5gyU4_2wsclkzLallIz7nZEpFQo0"
                          >
                            <img
                              src="https://portal.motforex.com/static-files/120/darkTelegramIcon.png"
                              alt="Icon"
                              style="height: 20px; width: 20px"
                            />
                          </a>
                        </li>
                        <li>
                          <a href="https://www.youtube.com/@motfxofficial">
                            <img
                              src="https://portal.motforex.com/static-files/120/darkYoutubeIcon.png"
                              alt="Icon"
                              style="height: 20px; width: 20px"
                            />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
              <!-- end: tr -->
            </table>
          </div>
        </center>
      </body>
    </html>
      `;
  return html;
};

module.exports = {
  generateFunds,
};
