import NotificationEvent from "./NotificationEvent";

export default interface SlackEvent extends NotificationEvent {
    from?: string
    message?: string,
    type: "alert" | "error" | "batch" | "urgent"
}
