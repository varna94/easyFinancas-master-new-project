const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const details = require("./details.json");


const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log("The server started on port 3000 !!!!!!");
});

app.get("/", (req, res) => {
    res.send(
        "<h1 style='text-align: center'>Você tem um convite para compartilhamento de finanças</h1>"
    );
});

app.post("/sendmail", (req, res) => {
    console.log("request came");
    let user = req.body;
    sendMail(user, info => {
        console.log(`The mail has beed send and the id is ${info.messageId}`);
        res.send(info);
    });
});


async function sendMail(user, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: details.email,
            pass: details.password
        }
    });

    let mailOptions = {
        from: '"Fun Of Heuristic"<example.gimail.com>', // sender address
        to: user.email, // list of receivers
        subject: "Wellcome to Fun Of Heuristic", // Subject line
        html: `
        <script>
                function testeLocalStorage(){
                  var LocalStorage = require('node-localstorage').LocalStorage;
                   localStorage = new LocalStorage('./scratch');
                  localStorage.setItem('idPai', 'user.idPai')
                }
                </script>
                <h1>Olá ${user.name}</h1><br>
              <h4>${user.nomeRemetente} convidou você para compartilhar as finanças!<br>
              Clique no botão a seguir para aceitar.</h4>
              <button onClick="testeLocalStorage()" id="${user.idPai}"><a href = 'http://localhost:4200/cadastro/${user.idPai}'>Aceitar</a></button>`
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    callback(info);
}
