const nodemailer = require('nodemailer');

const sendHelpEmail = async (req, res) => {
  const { helpMessage, email } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'skill.test.talent@gmail.com',
      pass: 'thzn lqst qcvb ursw',
    },
  });

  let mailOptions = {
    from: 'info@skilltest.app',
    to: 'mattianoris.business@gmail.com',
    subject: 'Richiesta di assistenza',
    text: `Email: ${email}\n\nMessaggio: ${helpMessage}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Errore nell\'invio dell\'email:', error);
      res.status(500).json({ message: 'Errore nell\'invio dell\'email', success: false });
    } else {
      console.log('Email inviata con successo:', info.response);
      res.status(200).json({ message: 'Email inviata con successo', success: true });
    }
  });
};

const welcomeEmail = async (name, email) => {

  let transporter = nodemailer.createTransport({
    secureConnection: true,
    //tls: { ciphers: 'SSLv3' },
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: "info@skilltest.app",
      pass: "gmjbkkqdmpfmgrmx",
    },
  });

  let mailOptions = {
    from: 'info@skilltest.app',
    to: email,
    subject: `${name}, siamo contenti di averti a bordo!`,
    html: `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
     <meta charset="UTF-8" />
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
     <!--[if !mso]><!-->
     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
     <!--<![endif]-->
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <meta name="format-detection" content="telephone=no" />
     <meta name="format-detection" content="date=no" />
     <meta name="format-detection" content="address=no" />
     <meta name="format-detection" content="email=no" />
     <meta name="x-apple-disable-message-reformatting" />
     <link href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900" rel="stylesheet" />
     <link href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900" rel="stylesheet" />
     <title>Welcome email</title>
     <!-- Made with Postcards by Designmodo https://designmodo.com/postcards -->
     <style>
     html,
             body {
                 margin: 0 !important;
                 padding: 0 !important;
                 min-height: 100% !important;
                 width: 100% !important;
                 -webkit-font-smoothing: antialiased;
             }
     
             * {
                 -ms-text-size-adjust: 100%;
             }
     
             #outlook a {
                 padding: 0;
             }
     
             .ReadMsgBody,
             .ExternalClass {
                 width: 100%;
             }
     
             .ExternalClass,
             .ExternalClass p,
             .ExternalClass td,
             .ExternalClass div,
             .ExternalClass span,
             .ExternalClass font {
                 line-height: 100%;
             }
     
             div[style*="margin: 14px 0"],
             div[style*="margin: 16px 0"] {
                 margin: 0 !important;
             }
     
             table,
             td,
             th {
                 mso-table-lspace: 0 !important;
                 mso-table-rspace: 0 !important;
                 border-collapse: collapse;
             }
     
             body, td, th, p, div, li, a, span {
                 -webkit-text-size-adjust: 100%;
                 -ms-text-size-adjust: 100%;
                 mso-line-height-rule: exactly;
             }
     
             img {
                 border: 0;
                 outline: none;
                 line-height: 100%;
                 text-decoration: none;
                 -ms-interpolation-mode: bicubic;
             }
     
             a[x-apple-data-detectors] {
                 color: inherit !important;
                 text-decoration: none !important;
             }
     
             .pc-gmail-fix {
                 display: none;
                 display: none !important;
             }
     
             @media (min-width: 621px) {
                 .pc-lg-hide {
                     display: none;
                 } 
     
                 .pc-lg-bg-img-hide {
                     background-image: none !important;
                 }
             }
     </style>
     <style>
     @media (max-width: 620px) {
     .pc-project-body {min-width: 0px !important;}
     .pc-project-container {width: 100% !important;}
     .pc-sm-hide {display: none !important;}
     .pc-sm-bg-img-hide {background-image: none !important;}
     table.pc-w620-spacing-0-0-40-0 {margin: 0px 0px 40px 0px !important;}
     td.pc-w620-spacing-0-0-40-0,th.pc-w620-spacing-0-0-40-0{margin: 0 !important;padding: 0px 0px 40px 0px !important;}
     .pc-w620-fontSize-30 {font-size: 30px !important;}
     .pc-w620-lineHeight-40 {line-height: 40px !important;}
     .pc-w620-fontSize-16 {font-size: 16px !important;}
     .pc-w620-lineHeight-26 {line-height: 26px !important;}
     .pc-w620-padding-35-35-35-35 {padding: 35px 35px 35px 35px !important;}
     .pc-w620-padding-20-0 {padding-top: 10px !important;padding-bottom: 10px !important;}
     .pc-w620-padding-0-10 {padding-left: 5px !important;padding-right: 5px !important;}
     .pc-w620-padding-34-35-34-35 {padding: 34px 35px 34px 35px !important;}
     
     .pc-w620-gridCollapsed-1 > tbody,.pc-w620-gridCollapsed-1 > tbody > tr,.pc-w620-gridCollapsed-1 > tr {display: inline-block !important;}
     .pc-w620-gridCollapsed-1.pc-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-width-fill > tr {width: 100% !important;}
     .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
     .pc-w620-gridCollapsed-1 > tbody > tr > td,.pc-w620-gridCollapsed-1 > tr > td {display: block !important;width: auto !important;padding-left: 0 !important;padding-right: 0 !important;}
     .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
     .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
     .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-first > .pc-grid-td-first,pc-w620-gridCollapsed-1 > .pc-grid-tr-first > .pc-grid-td-first {padding-top: 0 !important;}
     .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-last > .pc-grid-td-last,pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {padding-bottom: 0 !important;}
     
     .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {padding-top: 0 !important;}
     .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {padding-bottom: 0 !important;}
     .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {padding-left: 0 !important;}
     .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {padding-right: 0 !important;}
     
     .pc-w620-tableCollapsed-1 > tbody,.pc-w620-tableCollapsed-1 > tbody > tr,.pc-w620-tableCollapsed-1 > tr {display: block !important;}
     .pc-w620-tableCollapsed-1.pc-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
     .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
     .pc-w620-tableCollapsed-1 > tbody > tr > td,.pc-w620-tableCollapsed-1 > tr > td {display: block !important;width: auto !important;}
     .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
     .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
     }
     @media (max-width: 520px) {
     .pc-w520-padding-30-30-30-30 {padding: 30px 30px 30px 30px !important;}
     .pc-w520-padding-24-25-24-25 {padding: 24px 25px 24px 25px !important;}
     }
     </style>
     <!--[if !mso]><!-->
     <style>
     @media all { @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 200; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr6Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 900; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvC73w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 600; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu173w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 800; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr73w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 100; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R8WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 800; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqyR6WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 600; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq3p6WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 200; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqyR9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 500; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 700; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq0N6WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 500; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq5Z9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 900; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqw16WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 400; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 300; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCs16Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 300; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq_p9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 700; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 100; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Xw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 200; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr6Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 900; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvC73w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 600; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu173w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 800; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr73w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 100; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R8WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 800; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqyR6WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 600; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq3p6WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 200; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqyR9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 500; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 700; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq0N6WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 500; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq5Z9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 900; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqw16WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 400; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 300; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCs16Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 300; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq_p9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 700; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 100; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Xw3aXo.woff2') format('woff2'); } }
     </style>
     <!--<![endif]-->
     <!--[if mso]>
        <style type="text/css">
            .pc-font-alt {
                font-family: Arial, Helvetica, sans-serif !important;
            }
        </style>
        <![endif]-->
     <!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
    </head>
    
    <body class="pc-font-alt" style="width: 100% !important;min-height: 100% !important;margin: 0 !important;padding: 0 !important;line-height: 1.5;color: #2D3A41;mso-line-height-rule: exactly;-webkit-font-smoothing: antialiased;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;font-variant-ligatures: normal;text-rendering: optimizeLegibility;-moz-osx-font-smoothing: grayscale;background-color: #233142;" bgcolor="#233142">
     <table class="pc-project-body" style="table-layout: fixed;min-width: 993px;background-color:#233142;" bgcolor="#233142" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
      <tr>
       <td align="center" valign="top">
        <table class="pc-project-container" style="width: 993px; max-width: 993px;" width="993" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
         <tr>
          <td style="padding: 0px 0px 0px 0px;" align="left" valign="top">
           <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%;">
            <tr>
             <td valign="top">
              <!-- BEGIN MODULE: Header 2 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
               <tr>
                <td style="padding: 0px 0px 0px 0px;">
                 <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                   <td valign="top" class="pc-w520-padding-30-30-30-30 pc-w620-padding-35-35-35-35" style="padding: 40px 40px 40px 40px;border-radius: 0px;background-color: #233142;" bgcolor="#233142">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td class="pc-w620-spacing-0-0-40-0" align="center" valign="top" style="padding: 0px 0px 60px 0px;">
                       <img src="https://cloudfilesdm.com/postcards/image-1711049569891.png" class="" width="125" height="89" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:125px;height: auto;max-width: 100%;" />
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 17px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                        <tr>
                         <td valign="top" class="pc-font-alt" align="center" style="mso-line-height: exactly;line-height: 121%;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 14px;font-weight: 600;color: #40be65;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                          <div><span style="color: rgb(187, 187, 187);">SkillTest.app</span>
                          </div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 30px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                        <tr>
                         <td valign="top" class="pc-font-alt pc-w620-fontSize-30 pc-w620-lineHeight-40" align="center" style="mso-line-height: exactly;line-height: 128%;letter-spacing: -0.6px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 36px;font-weight: bold;color: #ffffff;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                          <div><span>Grazie per l&#39;iscrizione</span>
                          </div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 30px 0px;">
                       <img src="https://cloudfilesdm.com/postcards/image-1711049729439.png" class="" width="285" height="285" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:285px;height: auto;max-width: 100%;" />
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 29px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                        <tr>
                         <td valign="top" class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-26" align="center" style="mso-line-height: exactly;line-height: 156%;letter-spacing: -0.2px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 16px;font-weight: 300;color: #ffffff;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                          <div><span>Per ringraziarti dell&#39;iscrizione e farti usare al meglio la piattaforma per ottenere il miglior risultato ti vogliamo regalare una guida </span>
                          </div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center">
                       <table class="pc-width-hug pc-w620-gridCollapsed-0" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr class="pc-grid-tr-first pc-grid-tr-last">
                         <td class="pc-grid-td-first pc-grid-td-last" valign="top" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                           <tr>
                            <td align="center" valign="top">
                             <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                               <td align="center" valign="top">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <th valign="top" align="center" style="padding: 0px 0px 0px 0px; font-weight: normal; line-height: 1;">
                                   <!--[if mso]>
            <table  border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="border-collapse: separate; margin-right: auto; margin-left: auto;">
                <tr>
                    <td valign="middle" align="center" style="border-radius: 8px; background-color: #f95959; text-align: center; color: #ffffff; padding: 15px 17px 15px 17px; mso-padding-left-alt: 0; margin-left:17px;" bgcolor="#f95959">
                                        <a class="pc-font-alt" style="display: inline-block; text-decoration: none; font-variant-ligatures: normal; font-family: Montserrat, Arial, Helvetica, sans-serif; font-weight: 500; font-size: 16px; line-height: 150%; letter-spacing: -0.2px; color: #ffffff;" href="https://drive.google.com/file/d/1awx2Dv2ufAyGFxtt5yUl71DeCQvnbrzL/view?usp=sharing" target="_blank">Scarica la guida</a>
                                    </td>
                </tr>
            </table>
            <![endif]-->
                                   <!--[if !mso]><!-- --><a style="display: inline-block; border-radius: 8px; background-color: #f95959; padding: 15px 17px 15px 17px; font-family: Montserrat, Arial, Helvetica, sans-serif; font-weight: 500; font-size: 16px; line-height: 150%; letter-spacing: -0.2px; color: #ffffff; vertical-align: top; text-align: center; text-align-last: center; text-decoration: none; -webkit-text-size-adjust: none;" href="https://designmodo.com/postcards" target="_blank">Scarica la guida</a>
                                   <!--<![endif]-->
                                  </th>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                   </td>
                  </tr>
                 </table>
                </td>
               </tr>
              </table>
              <!-- END MODULE: Header 2 -->
             </td>
            </tr>
            <tr>
             <td valign="top">
              <!-- BEGIN MODULE: Content 5 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
               <tr>
                <td style="padding: 0px 0px 0px 0px;">
                 <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                   <td valign="top" class="pc-w520-padding-30-30-30-30 pc-w620-padding-35-35-35-35" style="padding: 40px 40px 40px 40px;border-radius: 0px;background-color: #233142;" bgcolor="#233142">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 11px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                        <tr>
                         <td valign="top" class="pc-font-alt" align="center" style="mso-line-height: exactly;line-height: 142%;letter-spacing: -0.4px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 24px;font-weight: 600;color: #ffffff;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                          <div><span>Top Stories.</span>
                          </div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <th valign="top" align="center" style="padding: 0px 0px 30px 0px; font-weight: normal; line-height: 1;">
                       <!--[if mso]>
            <table  border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="border-collapse: separate; margin-right: auto; margin-left: auto;">
                <tr>
                    <td valign="middle" align="center" style="border-radius: 40px; border: 1px solid #cdced2; text-align: center; color: #ffffff; padding: 6px 9px 6px 12px;">
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                                                            <td valign="middle">
                                    <a class="pc-font-alt" style="display: inline-block; text-decoration: none; font-variant-ligatures: normal; font-family: Montserrat, Arial, Helvetica, sans-serif; font-weight: normal; font-size: 14px; line-height: 100%; color: #f1f1f1;" target="_blank">Leggi di più</a>
                                </td>
                                <td style="font-size: 0; padding-left: 6px;" valign="middle"><img src="https://blog.skilltest.app" style="border: 0; width: 6px; height: 9px; line-height: 100%; -ms-interpolation-mode: bicubic;" alt="" width="6" height="9"/></td>                        </tr>
                        </table>
                                    </td>
                </tr>
            </table>
            <![endif]-->
                       <!--[if !mso]><!-- --><a style="display: inline-block; border: 1px solid #cdced2; border-radius: 40px; padding: 6px 9px 6px 12px; font-family: Montserrat, Arial, Helvetica, sans-serif; font-weight: normal; font-size: 14px; line-height: 100%; color: #f1f1f1; vertical-align: top; text-align: center; text-align-last: center; text-decoration: none; -webkit-text-size-adjust: none; mso-hide: all;" target="_blank"><span style="display: inline-block; vertical-align: middle;">Leggi di più</span><img src="https://blog.skilltest.app" width="6" height="9" alt="" style="width: 6px; height: 9px; margin-bottom: 1px; margin-left: 6px; mso-para-margin-left: 6px; display: inline-block; border: 0; vertical-align: middle; line-height: 100%; -ms-interpolation-mode: bicubic;"/></a>
                       <!--<![endif]-->
                      </th>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td>
                       <table class="pc-width-fill pc-w620-gridCollapsed-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr class="pc-grid-tr-first pc-grid-tr-last">
                         <td class="pc-grid-td-first pc-w620-padding-20-0" align="left" valign="top" style="width: 50%; padding-top: 0px; padding-right: 20px; padding-bottom: 0px; padding-left: 0px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                           <tr>
                            <td align="center" valign="top">
                             <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                              <tr>
                               <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="center" valign="top" style="padding: 0px 0px 14px 0px;">
                                   <img src="https://cloudfilesdm.com/postcards/image-1711050641262.png" class="" width="240" height="240" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:240px;height: auto;max-width: 100%;border-radius: 8px;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                              <tr>
                               <td align="center" valign="top">
                               </td>
                              </tr>
                              <tr>
                               <td align="center" valign="top">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td valign="top" style="padding: 0px 0px 10px 0px;">
                                   <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                    <tr>
                                     <td valign="top" align="center">
                                      <div class="pc-font-alt" style="line-height: 142%;letter-spacing: -0.4px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 20px;font-weight: 600;font-variant-ligatures: normal;color: #ffffff;text-align: center;text-align-last: center;">
                                       <div><span>Casi d&#39;uso di SkillTest</span>
                                       </div>
                                      </div>
                                     </td>
                                    </tr>
                                   </table>
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                              <tr>
                               <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="margin-right: auto; margin-left: auto;">
                                 <tr>
                                  <td valign="top" align="center">
                                   <div class="pc-font-alt" style="line-height: 156%;letter-spacing: -0.2px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 14px;font-weight: normal;font-variant-ligatures: normal;color: #9b9b9b;text-align: center;text-align-last: center;">
                                    <div><span>Ci siamo resi conto che nel 2024 la valutazione delle persone basate su dati è fondamentale.. </span>
                                    </div>
                                   </div>
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                         <td class="pc-grid-td-last pc-w620-padding-20-0" align="left" valign="top" style="width: 50%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 20px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                           <tr>
                            <td align="center" valign="top">
                             <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                              <tr>
                               <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="center" valign="top" style="padding: 0px 0px 14px 0px;">
                                   <img src="https://cloudfilesdm.com/postcards/image-1711050647683.png" class="" width="240" height="233" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:240px;height: auto;max-width: 100%;border-radius: 8px;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                              <tr>
                               <td align="center" valign="top">
                               </td>
                              </tr>
                              <tr>
                               <td align="center" valign="top">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td valign="top" style="padding: 0px 0px 10px 0px;">
                                   <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                    <tr>
                                     <td valign="top" align="center">
                                      <div class="pc-font-alt" style="line-height: 142%;letter-spacing: -0.4px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 20px;font-weight: 600;font-variant-ligatures: normal;color: #ffffff;text-align: center;text-align-last: center;">
                                       <div><span>Come ottenere il 100% dal nostro servizio</span>
                                       </div>
                                      </div>
                                     </td>
                                    </tr>
                                   </table>
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                              <tr>
                               <td align="center" valign="top">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="margin-right: auto; margin-left: auto;">
                                 <tr>
                                  <td valign="top" align="center">
                                   <div class="pc-font-alt" style="line-height: 156%;letter-spacing: -0.2px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 14px;font-weight: normal;font-variant-ligatures: normal;color: #9b9b9b;text-align: center;text-align-last: center;">
                                    <div><span>Tramite le nostre 3 tipologie di test valutare e qualificare il candidato diventa semplice..</span>
                                    </div>
                                   </div>
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                   </td>
                  </tr>
                 </table>
                </td>
               </tr>
              </table>
              <!-- END MODULE: Content 5 -->
             </td>
            </tr>
            <tr>
             <td valign="top">
              <!-- BEGIN MODULE: Menu 5 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
               <tr>
                <td style="padding: 0px 0px 0px 0px;">
                 <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                   <td valign="top" class="pc-w520-padding-24-25-24-25 pc-w620-padding-34-35-34-35" style="padding: 39px 40px 39px 40px;border-radius: 0px;background-color: #233142;" bgcolor="#233142">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="left">
                       <table class="pc-width-hug pc-w620-gridCollapsed-1" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr class="pc-grid-tr-first pc-grid-tr-last">
                         <td class="pc-grid-td-first pc-w620-padding-20-0" valign="middle" style="padding-top: 0px; padding-right: 10px; padding-bottom: 0px; padding-left: 0px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                           <tr>
                            <td align="left" valign="top">
                             <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                               <td align="left" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="left" valign="top">
                                   <img src="https://cloudfilesdm.com/postcards/image-1711050786661.png" class="" width="125" height="24" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:125px;height: auto;max-width: 100%;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                         <td class="pc-grid-td-last pc-w620-padding-20-0" valign="middle" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 10px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                           <tr>
                            <td align="left" valign="top">
                             <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                               <td align="left" valign="top">
                                <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="left">
                                   <table class="pc-width-hug pc-w620-gridCollapsed-0" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                    <tr class="pc-grid-tr-first pc-grid-tr-last">
                                     <td class="pc-grid-td-first pc-w620-padding-0-10" valign="top" style="padding-top: 0px; padding-right: 10px; padding-bottom: 0px; padding-left: 0px;">
                                     </td>
                                     <td class="pc-w620-padding-0-10" valign="top" style="padding-top: 0px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;">
                                     </td>
                                     <td class="pc-w620-padding-0-10" valign="top" style="padding-top: 0px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                       <tr>
                                        <td align="left" valign="top">
                                         <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                          <tr>
                                           <td align="left" valign="top">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left">
                                             <tr>
                                              <td valign="top" align="left">
                                               <div class="pc-font-alt" style="line-height: 121%;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 14px;font-weight: 500;font-variant-ligatures: normal;color: #ffffff;text-decoration: underline;text-align: left;text-align-last: left;">
                                                <div><span style="text-decoration: underline;">Crea Test</span>
                                                </div>
                                               </div>
                                              </td>
                                             </tr>
                                            </table>
                                           </td>
                                          </tr>
                                         </table>
                                        </td>
                                       </tr>
                                      </table>
                                     </td>
                                     <td class="pc-grid-td-last pc-w620-padding-0-10" valign="top" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 10px;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                       <tr>
                                        <td align="left" valign="top">
                                         <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                          <tr>
                                           <td align="left" valign="top">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="left">
                                             <tr>
                                              <td valign="top" align="left">
                                               <div class="pc-font-alt" style="line-height: 121%;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 14px;font-weight: 500;font-variant-ligatures: normal;color: #ffffff;text-decoration: underline;text-align: left;text-align-last: left;">
                                                <div><span style="text-decoration: underline;">Login</span>
                                                </div>
                                               </div>
                                              </td>
                                             </tr>
                                            </table>
                                           </td>
                                          </tr>
                                         </table>
                                        </td>
                                       </tr>
                                      </table>
                                     </td>
                                    </tr>
                                   </table>
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                   </td>
                  </tr>
                 </table>
                </td>
               </tr>
              </table>
              <!-- END MODULE: Menu 5 -->
             </td>
            </tr>
           </table>
          </td>
         </tr>
        </table>
       </td>
      </tr>
     </table>
     <!-- Fix for Gmail on iOS -->
     <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
     </div>
    </body>
    
    </html>      
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Errore nell\'invio dell\'email:', error);
    } else {
      console.log('Email inviata con successo:', info.response);
    }
  });
};

const finishJobCandidate = async (name, email, score) => {

  let transporter = nodemailer.createTransport({
    secureConnection: true,
    //tls: { ciphers: 'SSLv3' },
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: "info@skilltest.app",
      pass: "gmjbkkqdmpfmgrmx",
    },
  });

  let mailOptions = {
    from: 'info@skilltest.app',
    to: email,
    subject: `${name}, hai fatto un ottimo punteggio!`,
    html: `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
     <meta charset="UTF-8" />
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
     <!--[if !mso]><!-->
     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
     <!--<![endif]-->
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <meta name="format-detection" content="telephone=no" />
     <meta name="format-detection" content="date=no" />
     <meta name="format-detection" content="address=no" />
     <meta name="format-detection" content="email=no" />
     <meta name="x-apple-disable-message-reformatting" />
     <link href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900" rel="stylesheet" />
     <title>Untitled</title>
     <!-- Made with Postcards by Designmodo https://designmodo.com/postcards -->
     <style>
     html,
             body {
                 margin: 0 !important;
                 padding: 0 !important;
                 min-height: 100% !important;
                 width: 100% !important;
                 -webkit-font-smoothing: antialiased;
             }
     
             * {
                 -ms-text-size-adjust: 100%;
             }
     
             #outlook a {
                 padding: 0;
             }
     
             .ReadMsgBody,
             .ExternalClass {
                 width: 100%;
             }
     
             .ExternalClass,
             .ExternalClass p,
             .ExternalClass td,
             .ExternalClass div,
             .ExternalClass span,
             .ExternalClass font {
                 line-height: 100%;
             }
     
             div[style*="margin: 14px 0"],
             div[style*="margin: 16px 0"] {
                 margin: 0 !important;
             }
     
             table,
             td,
             th {
                 mso-table-lspace: 0 !important;
                 mso-table-rspace: 0 !important;
                 border-collapse: collapse;
             }
     
             body, td, th, p, div, li, a, span {
                 -webkit-text-size-adjust: 100%;
                 -ms-text-size-adjust: 100%;
                 mso-line-height-rule: exactly;
             }
     
             img {
                 border: 0;
                 outline: none;
                 line-height: 100%;
                 text-decoration: none;
                 -ms-interpolation-mode: bicubic;
             }
     
             a[x-apple-data-detectors] {
                 color: inherit !important;
                 text-decoration: none !important;
             }
     
             .pc-gmail-fix {
                 display: none;
                 display: none !important;
             }
     
             @media (min-width: 621px) {
                 .pc-lg-hide {
                     display: none;
                 } 
     
                 .pc-lg-bg-img-hide {
                     background-image: none !important;
                 }
             }
     </style>
     <style>
     @media (max-width: 620px) {
     .pc-project-body {min-width: 0px !important;}
     .pc-project-container {width: 100% !important;}
     .pc-sm-hide {display: none !important;}
     .pc-sm-bg-img-hide {background-image: none !important;}
     table.pc-w620-spacing-0-0-40-0 {margin: 0px 0px 40px 0px !important;}
     td.pc-w620-spacing-0-0-40-0,th.pc-w620-spacing-0-0-40-0{margin: 0 !important;padding: 0px 0px 40px 0px !important;}
     .pc-w620-fontSize-30 {font-size: 30px !important;}
     .pc-w620-lineHeight-40 {line-height: 40px !important;}
     .pc-w620-fontSize-16 {font-size: 16px !important;}
     .pc-w620-lineHeight-26 {line-height: 26px !important;}
     .pc-w620-padding-35-35-35-35 {padding: 35px 35px 35px 35px !important;}
     
     .pc-w620-gridCollapsed-1 > tbody,.pc-w620-gridCollapsed-1 > tbody > tr,.pc-w620-gridCollapsed-1 > tr {display: inline-block !important;}
     .pc-w620-gridCollapsed-1.pc-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-width-fill > tr {width: 100% !important;}
     .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
     .pc-w620-gridCollapsed-1 > tbody > tr > td,.pc-w620-gridCollapsed-1 > tr > td {display: block !important;width: auto !important;padding-left: 0 !important;padding-right: 0 !important;}
     .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
     .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
     .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-first > .pc-grid-td-first,pc-w620-gridCollapsed-1 > .pc-grid-tr-first > .pc-grid-td-first {padding-top: 0 !important;}
     .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-last > .pc-grid-td-last,pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {padding-bottom: 0 !important;}
     
     .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {padding-top: 0 !important;}
     .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {padding-bottom: 0 !important;}
     .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {padding-left: 0 !important;}
     .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {padding-right: 0 !important;}
     
     .pc-w620-tableCollapsed-1 > tbody,.pc-w620-tableCollapsed-1 > tbody > tr,.pc-w620-tableCollapsed-1 > tr {display: block !important;}
     .pc-w620-tableCollapsed-1.pc-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
     .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
     .pc-w620-tableCollapsed-1 > tbody > tr > td,.pc-w620-tableCollapsed-1 > tr > td {display: block !important;width: auto !important;}
     .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
     .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
     }
     @media (max-width: 520px) {
     .pc-w520-padding-30-30-30-30 {padding: 30px 30px 30px 30px !important;}
     }
     </style>
     <!--[if !mso]><!-->
     <style>
     @media all { @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 200; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr6Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 900; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvC73w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 600; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu173w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 800; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr73w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 100; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R8WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 800; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqyR6WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 600; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq3p6WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 200; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqyR9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 500; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 700; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq0N6WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 500; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq5Z9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 900; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jqw16WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 400; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 300; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCs16Hw3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: italic; font-weight: 300; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq_p9WXZ0pg.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 700; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w3aXo.woff2') format('woff2'); } @font-face { font-family: 'Montserrat'; font-style: normal; font-weight: 100; src: url('https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Xw3aXo.woff2') format('woff2'); } }
     </style>
     <!--<![endif]-->
     <!--[if mso]>
        <style type="text/css">
            .pc-font-alt {
                font-family: Arial, Helvetica, sans-serif !important;
            }
        </style>
        <![endif]-->
     <!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
    </head>
    
    <body class="pc-font-alt" style="width: 100% !important;min-height: 100% !important;margin: 0 !important;padding: 0 !important;line-height: 1.5;color: #2D3A41;mso-line-height-rule: exactly;-webkit-font-smoothing: antialiased;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;font-variant-ligatures: normal;text-rendering: optimizeLegibility;-moz-osx-font-smoothing: grayscale;background-color: #233142;" bgcolor="#233142">
     <table class="pc-project-body" style="table-layout: fixed;min-width: 913px;background-color:#233142;" bgcolor="#233142" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
      <tr>
       <td align="center" valign="top">
        <table class="pc-project-container" style="width: 913px; max-width: 913px;" width="913" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
         <tr>
          <td style="padding: 20px 0px 20px 0px;" align="left" valign="top">
           <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%;">
            <tr>
             <td valign="top">
              <!-- BEGIN MODULE: Header 2 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
               <tr>
                <td style="padding: 0px 0px 0px 0px;">
                 <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                   <td valign="top" class="pc-w520-padding-30-30-30-30 pc-w620-padding-35-35-35-35" style="padding: 40px 40px 40px 40px;border-radius: 0px;background-color: #233142;" bgcolor="#233142">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td class="pc-w620-spacing-0-0-40-0" align="center" valign="top" style="padding: 0px 0px 60px 0px;">
                       <img src="https://cloudfilesdm.com/postcards/image-1711130038593.png" class="" width="145" height="104" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:145px;height: auto;max-width: 100%;" />
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 17px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                        <tr>
                         <td valign="top" class="pc-font-alt" align="center" style="mso-line-height: exactly;line-height: 121%;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 14px;font-weight: 500;color: #40be65;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                          <div><span style="color: #e1e1e1;">SkillTest.app</span>
                          </div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 30px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                        <tr>
                         <td valign="top" class="pc-font-alt pc-w620-fontSize-30 pc-w620-lineHeight-40" align="center" style="mso-line-height: exactly;line-height: 128%;letter-spacing: -0.6px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 36px;font-weight: 800;color: #ffffff;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                          <div><span>Complimenti, hai completato il test</span>
                          </div>
                          <div><span>con un punteggio di ${score}%</span>
                          </div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 30px 0px;">
                       <img src="https://cloudfilesdm.com/postcards/image-1711130125470.png" class="" width="285" height="277" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:285px;height: auto;max-width: 100%;" />
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 29px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                        <tr>
                         <td valign="top" class="pc-font-alt pc-w620-fontSize-16 pc-w620-lineHeight-26" align="center" style="mso-line-height: exactly;line-height: 156%;letter-spacing: -0.2px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 18px;font-weight: 300;color: #ffffff;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                          <div><span>Con noi verrai valutato non solo per il CV ma anche per le risposte che hai dato</span>
                          </div>
                          <div><span>in fase di candidatura, perchè crediamo che tramite un curriculum non si riesce a</span>
                          </div>
                          <div><span>trasmettere il meglio di una persona.</span>
                          </div>
                          <div><span>&#xFEFF;</span>
                          </div>
                          <div><span>Ti vogliamo anche lasciare una guida gratuita su come impostare correttamente</span>
                          </div>
                          <div><span>il tuo profilo LinkedIn per trovare il lavoro perfetto per te.</span>
                          </div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center">
                       <table class="pc-width-hug pc-w620-gridCollapsed-0" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr class="pc-grid-tr-first pc-grid-tr-last">
                         <td class="pc-grid-td-first pc-grid-td-last" valign="top" style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                           <tr>
                            <td align="center" valign="top">
                             <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                               <td align="center" valign="top">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <th valign="top" align="center" style="padding: 0px 0px 0px 0px; font-weight: normal; line-height: 1;">
                                   <!--[if mso]>
            <table  border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="border-collapse: separate; margin-right: auto; margin-left: auto;">
                <tr>
                    <td valign="middle" align="center" style="border-radius: 8px; background-color: #f95959; text-align: center; color: #ffffff; padding: 15px 17px 15px 17px; mso-padding-left-alt: 0; margin-left:17px;" bgcolor="#f95959">
                                        <a class="pc-font-alt" style="display: inline-block; text-decoration: none; font-variant-ligatures: normal; font-family: Montserrat, Arial, Helvetica, sans-serif; font-weight: 500; font-size: 16px; line-height: 150%; letter-spacing: -0.2px; color: #ffffff;" href="https://drive.google.com/file/d/1fKPRVT5RmIxQj2P-YLPvRoehZb1BdUl4/view?usp=sharing" target="_blank">Scarica la guida</a>
                                    </td>
                </tr>
            </table>
            <![endif]-->
                                   <!--[if !mso]><!-- --><a style="display: inline-block; border-radius: 8px; background-color: #f95959; padding: 15px 17px 15px 17px; font-family: Montserrat, Arial, Helvetica, sans-serif; font-weight: 500; font-size: 16px; line-height: 150%; letter-spacing: -0.2px; color: #ffffff; vertical-align: top; text-align: center; text-align-last: center; text-decoration: none; -webkit-text-size-adjust: none;" href="https://designmodo.com/postcards" target="_blank">Scarica la guida</a>
                                   <!--<![endif]-->
                                  </th>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                   </td>
                  </tr>
                 </table>
                </td>
               </tr>
              </table>
              <!-- END MODULE: Header 2 -->
             </td>
            </tr>
            <tr>
             <td valign="top">
              <!-- BEGIN MODULE: Content 4 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
               <tr>
                <td style="padding: 0px 0px 0px 0px;">
                 <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                  <tr>
                   <td valign="top" class="pc-w520-padding-30-30-30-30 pc-w620-padding-35-35-35-35" style="padding: 40px 40px 40px 40px;border-radius: 0px;background-color: #ffffff;" bgcolor="#ffffff">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 10px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                        <tr>
                         <td valign="top" class="pc-font-alt" align="center" style="padding: 0px 20px 0px 20px;mso-line-height: exactly;line-height: 142%;letter-spacing: -0.4px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 24px;font-weight: bold;color: #151515;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                          <div><span style="color: #233142;">I nostri partner</span>
                          </div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td align="center" valign="top" style="padding: 0px 0px 40px 0px;">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
                        <tr>
                         <td valign="top" class="pc-font-alt" align="center" style="mso-line-height: exactly;line-height: 113%;letter-spacing: -0.2px;font-family: Montserrat, Arial, Helvetica, sans-serif;font-size: 16px;font-weight: normal;color: #9b9b9b;text-align: center;text-align-last: center;font-variant-ligatures: normal;">
                          <div><span>Alcuni dei migliori candidati sono stati assunti da uno dei nostri partner</span>
                          </div>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                     <tr>
                      <td>
                       <table class="pc-width-fill pc-w620-gridCollapsed-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr class="pc-grid-tr-first">
                         <td class="pc-grid-td-first" align="center" valign="middle" style="width: 25%; padding-top: 0px; padding-right: 20px; padding-bottom: 20px; padding-left: 0px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                           <tr>
                            <td align="center" valign="middle">
                             <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                              <tr>
                               <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="center" valign="top">
                                   <img src="https://cloudfilesdm.com/postcards/content-4-image-1.jpg" class="" width="67" height="19" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:67px;height: auto;max-width: 100%;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                         <td align="center" valign="middle" style="width: 25%; padding-top: 0px; padding-right: 20px; padding-bottom: 20px; padding-left: 20px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                           <tr>
                            <td align="center" valign="middle">
                             <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                              <tr>
                               <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="center" valign="top">
                                   <img src="https://cloudfilesdm.com/postcards/content-4-image-2.jpg" class="" width="86" height="29" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:86px;height: auto;max-width: 100%;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                         <td align="center" valign="middle" style="width: 25%; padding-top: 0px; padding-right: 20px; padding-bottom: 20px; padding-left: 20px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                           <tr>
                            <td align="center" valign="middle">
                             <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                              <tr>
                               <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="center" valign="top">
                                   <img src="https://cloudfilesdm.com/postcards/content-4-image-3.jpg" class="" width="32" height="38" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:32px;height: auto;max-width: 100%;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                         <td class="pc-grid-td-last" align="center" valign="middle" style="width: 25%; padding-top: 0px; padding-right: 0px; padding-bottom: 20px; padding-left: 20px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                           <tr>
                            <td align="center" valign="middle">
                             <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                              <tr>
                               <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="center" valign="top">
                                   <img src="https://cloudfilesdm.com/postcards/content-4-image-4.jpg" class="" width="93" height="20" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:93px;height: auto;max-width: 100%;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                        <tr class="pc-grid-tr-last">
                         <td class="pc-grid-td-first" align="center" valign="middle" style="width: 25%; padding-top: 20px; padding-right: 20px; padding-bottom: 0px; padding-left: 0px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                           <tr>
                            <td align="center" valign="middle">
                             <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                              <tr>
                               <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="center" valign="top">
                                   <img src="https://cloudfilesdm.com/postcards/content-4-image-5.jpg" class="" width="94" height="18" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:94px;height: auto;max-width: 100%;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                         <td align="center" valign="middle" style="width: 25%; padding-top: 20px; padding-right: 20px; padding-bottom: 0px; padding-left: 20px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                           <tr>
                            <td align="center" valign="middle">
                             <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                              <tr>
                               <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="center" valign="top">
                                   <img src="https://cloudfilesdm.com/postcards/content-4-image-6.jpg" class="" width="87" height="29" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:87px;height: auto;max-width: 100%;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                         <td align="center" valign="middle" style="width: 25%; padding-top: 20px; padding-right: 20px; padding-bottom: 0px; padding-left: 20px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                           <tr>
                            <td align="center" valign="middle">
                             <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                              <tr>
                               <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="center" valign="top">
                                   <img src="https://cloudfilesdm.com/postcards/content-4-image-7.jpg" class="" width="39" height="46" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:39px;height: auto;max-width: 100%;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                         <td class="pc-grid-td-last" align="center" valign="middle" style="width: 25%; padding-top: 20px; padding-right: 0px; padding-bottom: 0px; padding-left: 20px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                           <tr>
                            <td align="center" valign="middle">
                             <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                              <tr>
                               <td align="center" valign="top">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td align="center" valign="top">
                                   <img src="https://cloudfilesdm.com/postcards/content-4-image-8.jpg" class="" width="100" height="22" alt="" style="display: block;border: 0;outline: 0;line-height: 100%;-ms-interpolation-mode: bicubic;width:100px;height: auto;max-width: 100%;" />
                                  </td>
                                 </tr>
                                </table>
                               </td>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
                    </table>
                   </td>
                  </tr>
                 </table>
                </td>
               </tr>
              </table>
              <!-- END MODULE: Content 4 -->
             </td>
            </tr>
           </table>
          </td>
         </tr>
        </table>
       </td>
      </tr>
     </table>
     <!-- Fix for Gmail on iOS -->
     <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
     </div>
    </body>
    </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Errore nell\'invio dell\'email:', error);
    } else {
      console.log('Email inviata con successo:', info.response);
    }
  });
};
//finishJobCandidate("Mattia", "mattianoris23@gmail.com", "90")
module.exports = { sendHelpEmail, welcomeEmail, finishJobCandidate };
