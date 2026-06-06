import Badge from "./ui/Badge";

function UsageBadge({ usage, type = "chat" }) {
    if (!usage?.[type]) return null;

    const { used, limit } = usage[type];

    const variant =
        used >= limit ? "muted" : used >= limit * 0.8 ? "cyan" : "default";

    return (
        <Badge variant={variant} className="text-xs">
            {used} / {limit} {type === "chat" ? "chats" : "uploads"} today
        </Badge>
    );
}

export default UsageBadge;
