

export const metrics = [
    { label: "Total Revenue", value: "$54.2K", change: "+12.5%", trend: "up" },
];


export const dashboardMetrics = [
    {
        label: "Total Revenue",
        value: "$54.2K",
        change: "+12.5%",
        trend: "up",
    },
    {
        label: "Active Users",
        value: "8,549",
        change: "+8.2%",
        trend: "up",
    },
    {
        label: "Documents",
        value: "124.5K",
        change: "+23.1%",
        trend: "up",
    },
    {
        label: "API Usage",
        value: "2.4M",
        change: "-3.2%",
        trend: "down",
    },
];

export const dashboardActivities = [
    {
        type: "success",
        title: "New Enterprise signup",
        description: "sarah@acme.com joined Enterprise plan",
        time: "2 min ago",
    },
    {
        type: "success",
        title: "Document processed",
        description: "1,234 pages summarized successfully",
        time: "15 min ago",
    },
    {
        type: "warning",
        title: "High API usage",
        description: "user@company.com at 85% quota",
        time: "1 hour ago",
    },
    {
        type: "error",
        title: "Processing failed",
        description: "Voice file conversion error",
        time: "2 hours ago",
    },
];

export const systemStatus = [
    {
        name: "API Gateway",
        latency: "45ms",
        uptime: "99.9%",
        status: "ok",
    },
    {
        name: "Database",
        latency: "12ms",
        uptime: "99.8%",
        status: "ok",
    },
    {
        name: "STT Service",
        latency: "234ms",
        uptime: "98.5%",
        status: "ok",
    },
    {
        name: "AI Processing",
        latency: "1.2s",
        uptime: "97.2%",
        status: "degraded",
    },
];
