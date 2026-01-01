"use client";

import SessionItem from "./SessionItem";

const mockSessions = [
    { sessionId: 1, sessionTitle: "3월 마케팅 회의" },
    { sessionId: 2, sessionTitle: "FloCut 기획 정리" },
];

export default function SessionList() {
    return (
        <div className="space-y-1">
            {mockSessions.map((session) => (
                <SessionItem
                    key={session.sessionId}
                    sessionId={session.sessionId}
                    title={session.sessionTitle}
                />
            ))}
        </div>
    );
}
