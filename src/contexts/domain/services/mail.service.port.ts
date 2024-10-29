import { Mail } from '@/contexts/domain/models/mail.entity';

export abstract class MailService {
    abstract send(mail: Mail): Promise<boolean>;
    abstract sendMany(mail: Mail): Promise<boolean>;
}
