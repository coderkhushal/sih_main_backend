import nodemailer from "nodemailer"
export class MailManager{
    private static instance : MailManager
     private username : string 
    private password : string
    private transporter : nodemailer.Transporter | null
    private constructor(){
        this.username = process.env.NODEMAILER_USERNAME as string
        this.password = process.env.NODEMAILER_PASSWORD as string
        this.transporter = null

    }
    public static getInstance(): MailManager{
        if(!MailManager.instance){
            MailManager.instance = new MailManager()
        }
        return this.instance
    }
 async sendMail(to: string, token :string){
    
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.username,
                pass: this.password
            }
        })

        const content = `
        <h1>Reset Password</h1>
        <p>Click on the link below to reset your password</p>
        <a href="http://localhost:5173/reset-password/${token}">Reset Password</a>
        `
        const mailOptions = {
            from: "rajeshbhasin4488@gmail.com",
            to: to ,
            subject: "Reset Password",
            html: content
        }
        let p = new Promise((resolve, reject)=>{
            this.transporter?.sendMail(mailOptions, (err, info)=>{
                if(err){
                    console.log(err)
                    reject(false)
                }
                else{
                    console.log(info)
                    resolve(true)
                }
            })
        })
        return p;
    }   
}