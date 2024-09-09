import NotificationEvent from "./NotificationEvent";

export default interface SmsEvent extends NotificationEvent {
    phone: string
    template: string
    param1: string
}
