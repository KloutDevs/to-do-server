export interface Mail {
    to: MailTo[],
    from: MailFrom,
    subject: string,
    text: string,
    html: string,
    customId?: string,
}

export interface MailTo {
    name?: string,
    email: string,
}

export interface MailFrom {
    name: string,
    email: string,
}