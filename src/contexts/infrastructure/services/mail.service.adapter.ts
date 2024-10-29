import { MailService } from '@/contexts/domain/services';
import { MailerService } from '@nestjs-modules/mailer';
import { Mail } from '@/contexts/domain/models/mail.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NestMailRepository implements MailService {
    constructor(private readonly mailerService: MailerService) {}
    async send(mail: Mail): Promise<boolean> {
        try{
            const sendMail = await this.mailerService.sendMail({
                to: mail.to[0].email,
                from: mail.from.email,
                subject: mail.subject,
                text: mail.text,
                html: mail.html,
            });
            if(sendMail.accepted.length > 0) return true;
            return false;
        }catch(error){
            console.log(error);
            return false;
        }
    }

    async sendMany(mail: Mail): Promise<boolean> {
        try{
            const sendMail = await this.mailerService.sendMail({
                to: mail.to.map(mailTo => mailTo.email),
                from: mail.from.email,
                subject: mail.subject,
                text: mail.text,
                html: mail.html,
            });
            if(sendMail.accepted.length > 0) return true;
            return false;
        }catch(error){
            console.log(error);
            return false;
        }
    }
}