import NotificationEvent from "./NotificationEvent";

export default interface MailEvent extends NotificationEvent {
    from: string
    to: string
    subject: string
    html: string
}
