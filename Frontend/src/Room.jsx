import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const getInitials = (name = "User") => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
};

function Room({ room, user, token, onBack }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [typingUser, setTypingUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ========================================
  // SCROLL TO BOTTOM
  // ========================================

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  // ========================================
  // FETCH MESSAGES
  // ========================================

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/rooms/${room._id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Messages API is not returning JSON. Check backend route."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch messages"
        );
      }

      setMessages(data.messages || []);

      scrollToBottom();
    } catch (error) {
      console.error(
        "Fetch messages error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SOCKET SETUP
  // ========================================

  useEffect(() => {
    if (!room?._id || !user?.id) {
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    // ========================================
    // CONNECTED
    // ========================================

    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );

      socket.emit("joinRoom", {
        roomId: room._id,
        userId: user.id,
      });

      socket.emit("userOnline", {
        roomId: room._id,
        userId: user.id,
        userName: user.name,
      });
    });

    // ========================================
    // RECEIVE MESSAGE
    // ========================================

    socket.on(
      "receiveMessage",
      (newMessage) => {
        console.log(
          "New message received:",
          newMessage
        );

        setMessages(
          (previousMessages) => {
            const alreadyExists =
              previousMessages.some(
                (message) =>
                  message._id ===
                  newMessage._id
              );

            if (alreadyExists) {
              return previousMessages;
            }

            return [
              ...previousMessages,
              newMessage,
            ];
          }
        );

        setTypingUser("");

        scrollToBottom();
      }
    );

    // ========================================
    // USER TYPING
    // ========================================

    socket.on(
      "userTyping",
      (data) => {
        if (!data?.userName) {
          return;
        }

        setTypingUser(
          `${data.userName} is typing`
        );
      }
    );

    // ========================================
    // USER STOPPED TYPING
    // ========================================

    socket.on(
      "userStoppedTyping",
      () => {
        setTypingUser("");
      }
    );

    // ========================================
    // USER ONLINE
    // ========================================

    socket.on(
      "userOnline",
      (data) => {
        if (!data?.userId) {
          return;
        }

        // Don't add current user
        if (
          data.userId.toString() ===
          user.id.toString()
        ) {
          return;
        }

        setOnlineUsers(
          (previousUsers) => {
            const alreadyOnline =
              previousUsers.some(
                (onlineUser) =>
                  onlineUser.userId ===
                  data.userId
              );

            if (alreadyOnline) {
              return previousUsers;
            }

            return [
              ...previousUsers,
              data,
            ];
          }
        );
      }
    );

    // ========================================
    // USER OFFLINE
    // ========================================

    socket.on(
      "userOffline",
      (data) => {
        if (!data?.userId) {
          return;
        }

        setOnlineUsers(
          (previousUsers) =>
            previousUsers.filter(
              (onlineUser) =>
                onlineUser.userId !==
                data.userId
            )
        );
      }
    );

    // ========================================
    // MESSAGE SEEN
    // ========================================

    socket.on(
      "messageSeen",
      (data) => {
        if (!data?.messageId) {
          return;
        }

        setMessages(
          (previousMessages) =>
            previousMessages.map(
              (message) => {
                if (
                  message._id !==
                  data.messageId
                ) {
                  return message;
                }

                return {
                  ...message,
                  seenBy:
                    data.seenBy || [],
                };
              }
            )
        );
      }
    );

    // ========================================
    // SOCKET ERROR
    // ========================================

    socket.on(
      "connect_error",
      (error) => {
        console.error(
          "Socket connection error:",
          error.message
        );
      }
    );

    // ========================================
    // FETCH OLD MESSAGES
    // ========================================

    fetchMessages();

    // ========================================
    // CLEANUP
    // ========================================

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(
          typingTimeoutRef.current
        );
      }

      socket.emit("userOffline", {
        roomId: room._id,
        userId: user.id,
        userName: user.name,
      });

      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("messageSeen");
      socket.off("connect_error");

      socket.disconnect();

      socketRef.current = null;
    };
  }, [room?._id, user?.id]);

  // ========================================
  // MARK MESSAGE AS SEEN
  // ========================================

  const markMessageAsSeen = (message) => {
    if (!message?._id) {
      return;
    }

    if (!socketRef.current?.connected) {
      return;
    }

    const senderId =
      typeof message.sender === "object"
        ? message.sender?._id
        : message.sender;

    // Don't mark own messages
    if (
      senderId?.toString() ===
      user.id?.toString()
    ) {
      return;
    }

    const alreadySeen =
      message.seenBy?.some(
        (seenUser) => {
          const seenUserId =
            typeof seenUser === "object"
              ? seenUser?._id
              : seenUser;

          return (
            seenUserId?.toString() ===
            user.id?.toString()
          );
        }
      );

    if (alreadySeen) {
      return;
    }

    socketRef.current.emit(
      "messageSeen",
      {
        messageId: message._id,
        userId: user.id,
        roomId: room._id,
      }
    );
  };

  // ========================================
  // MARK ALL MESSAGES AS SEEN
  // ========================================

  const markAllMessagesAsSeen = () => {
    messages.forEach((message) => {
      markMessageAsSeen(message);
    });
  };

  useEffect(() => {
    if (!loading && messages.length > 0) {
      markAllMessagesAsSeen();
    }
  }, [loading, messages.length]);

  // ========================================
  // SEND MESSAGE
  // ========================================

  const sendMessage = (event) => {
    event.preventDefault();

    const text = messageText.trim();

    if (!text) {
      return;
    }

    if (!socketRef.current) {
      setError(
        "Socket is not connected."
      );

      return;
    }

    if (!socketRef.current.connected) {
      setError(
        "Socket is not connected. Please refresh the page."
      );

      return;
    }

    setError("");

    socketRef.current.emit(
      "sendMessage",
      {
        roomId: room._id,
        sender: user.id,
        text,
      }
    );

    setMessageText("");

    socketRef.current.emit(
      "stopTyping",
      {
        roomId: room._id,
      }
    );

    setTypingUser("");

    scrollToBottom();
  };

  // ========================================
  // HANDLE TYPING
  // ========================================

  const handleTyping = (event) => {
    const value = event.target.value;

    setMessageText(value);

    if (!socketRef.current) {
      return;
    }

    if (!socketRef.current.connected) {
      return;
    }

    if (!value.trim()) {
      socketRef.current.emit(
        "stopTyping",
        {
          roomId: room._id,
        }
      );

      return;
    }

    socketRef.current.emit(
      "typing",
      {
        roomId: room._id,
        userName: user.name,
      }
    );

    if (typingTimeoutRef.current) {
      clearTimeout(
        typingTimeoutRef.current
      );
    }

    typingTimeoutRef.current =
      setTimeout(() => {
        socketRef.current?.emit(
          "stopTyping",
          {
            roomId: room._id,
          }
        );
      }, 1000);
  };

  // ========================================
  // ENTER KEY
  // ========================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage(event);
    }
  };

  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ========================================
  // FORMAT DATE LABEL
  // ========================================

  const formatDateLabel = (date) => {
    if (!date) {
      return "";
    }

    const messageDate =
      new Date(date);

    const today = new Date();

    const yesterday =
      new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    if (
      messageDate.toDateString() ===
      today.toDateString()
    ) {
      return "Today";
    }

    if (
      messageDate.toDateString() ===
      yesterday.toDateString()
    ) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString(
      [],
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ========================================
  // SAME DATE
  // ========================================

  const isSameDate = (
    firstDate,
    secondDate
  ) => {
    if (!firstDate || !secondDate) {
      return false;
    }

    return (
      new Date(
        firstDate
      ).toDateString() ===
      new Date(
        secondDate
      ).toDateString()
    );
  };

  // ========================================
  // CHECK SEEN
  // ========================================

  const isMessageSeen = (message) => {
    if (!message?.seenBy) {
      return false;
    }

    return message.seenBy.some(
      (seenUser) => {
        const seenUserId =
          typeof seenUser === "object"
            ? seenUser?._id
            : seenUser;

        return (
          seenUserId?.toString() !==
          user.id?.toString()
        );
      }
    );
  };

  // ========================================
  // ONLINE COUNT
  // ========================================

  const onlineCount =
    onlineUsers.length;

  // ========================================
  // UI
  // ========================================

  return (
    <div style={styles.page}>
      {/* ========================================
          HEADER
      ======================================== */}

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            style={styles.backButton}
            onClick={onBack}
            title="Back to rooms"
          >
            ←
          </button>

          <div style={styles.roomAvatar}>
            {getInitials(room.name)}
          </div>

          <div>
            <h1 style={styles.title}>
              {room.name}
            </h1>

            <div style={styles.statusRow}>
              <span
                style={{
                  ...styles.statusDot,
                  background:
                    onlineCount > 0
                      ? "#22c55e"
                      : "#94a3b8",
                }}
              />

              <span
                style={
                  onlineCount > 0
                    ? styles.onlineText
                    : styles.offlineText
                }
              >
                {onlineCount > 0
                  ? `${onlineCount} ${
                      onlineCount === 1
                        ? "member"
                        : "members"
                    } online`
                  : "No other members online"}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.memberBadge}>
            👥{" "}
            {room.members?.length || 0}
          </div>

          <button
            style={styles.desktopBackButton}
            onClick={onBack}
          >
            Back to Rooms
          </button>
        </div>
      </header>

      {/* ========================================
          CHAT
      ======================================== */}

      <main style={styles.chatWrapper}>
        <div style={styles.chatContainer}>
          {/* ========================================
              MESSAGE AREA
          ======================================== */}

          <div style={styles.messagesContainer}>
            {loading ? (
              <div style={styles.centerState}>
                <div
                  style={
                    styles.loadingCircle
                  }
                >
                  ...
                </div>

                <p style={styles.stateTitle}>
                  Loading conversation
                </p>

                <p style={styles.stateText}>
                  Please wait a moment.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div style={styles.centerState}>
                <div style={styles.emptyIcon}>
                  💬
                </div>

                <p style={styles.stateTitle}>
                  No messages yet
                </p>

                <p style={styles.stateText}>
                  Start the conversation
                  with your team.
                </p>
              </div>
            ) : (
              messages.map(
                (message, index) => {
                  const previousMessage =
                    messages[index - 1];

                  const showDateSeparator =
                    index === 0 ||
                    !isSameDate(
                      previousMessage?.createdAt,
                      message.createdAt
                    );

                  const senderId =
                    message.sender?._id ||
                    message.sender;

                  const isMine =
                    senderId?.toString() ===
                    user.id?.toString();

                  const senderName =
                    message.sender?.name ||
                    "Unknown User";

                  const isSeen =
                    isMine &&
                    isMessageSeen(message);

                  return (
                    <div
                      key={message._id}
                    >
                      {/* DATE SEPARATOR */}

                      {showDateSeparator && (
                        <div
                          style={
                            styles.dateSeparator
                          }
                        >
                          <span
                            style={
                              styles.dateLabel
                            }
                          >
                            {formatDateLabel(
                              message.createdAt
                            )}
                          </span>
                        </div>
                      )}

                      {/* MESSAGE ROW */}

                      <div
                        style={{
                          ...styles.messageRow,
                          justifyContent:
                            isMine
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        {!isMine && (
                          <div
                            style={
                              styles.senderAvatar
                            }
                          >
                            {getInitials(
                              senderName
                            )}
                          </div>
                        )}

                        <div
                          style={{
                            ...styles.message,
                            ...(isMine
                              ? styles.myMessage
                              : styles.otherMessage),
                          }}
                          onMouseEnter={() =>
                            markMessageAsSeen(
                              message
                            )
                          }
                        >
                          {!isMine && (
                            <div
                              style={
                                styles.senderName
                              }
                            >
                              {senderName}
                            </div>
                          )}

                          <div
                            style={
                              styles.messageContent
                            }
                          >
                            {message.text}
                          </div>

                          <div
                            style={{
                              ...styles.messageMeta,
                              justifyContent:
                                isMine
                                  ? "flex-end"
                                  : "flex-start",
                            }}
                          >
                            <span>
                              {formatTime(
                                message.createdAt
                              )}
                            </span>

                            {isMine && (
                              <span
                                style={{
                                  ...styles.seenStatus,
                                  color: isSeen
                                    ? "#2563eb"
                                    : "inherit",
                                }}
                              >
                                {isSeen
                                  ? "✓✓ Seen"
                                  : "✓ Sent"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            )}

            <div
              ref={messagesEndRef}
            />
          </div>

          {/* ========================================
              TYPING
          ======================================== */}

          {typingUser && (
            <div
              style={
                styles.typingContainer
              }
            >
              <div
                style={
                  styles.typingBubble
                }
              >
                <span
                  style={
                    styles.typingDot
                  }
                />
                <span
                  style={
                    styles.typingDot
                  }
                />
                <span
                  style={
                    styles.typingDot
                  }
                />
              </div>

              <span
                style={styles.typingText}
              >
                {typingUser}
              </span>
            </div>
          )}

          {/* ========================================
              ERROR
          ======================================== */}

          {error && (
            <div style={styles.error}>
              ⚠ {error}
            </div>
          )}

          {/* ========================================
              MESSAGE FORM
          ======================================== */}

          <form
            style={styles.messageForm}
            onSubmit={sendMessage}
          >
            <input
              type="text"
              placeholder="Write a message..."
              value={messageText}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              style={styles.messageInput}
            />

            <button
              type="submit"
              style={{
                ...styles.sendButton,
                opacity:
                  messageText.trim()
                    ? 1
                    : 0.55,
              }}
              disabled={
                !messageText.trim()
              }
            >
              <span>Send</span>
              <span
                style={styles.sendArrow}
              >
                →
              </span>
            </button>
          </form>

          <div
            style={styles.inputHint}
          >
            Press Enter to send
          </div>
        </div>
      </main>
    </div>
  );
}

// ========================================
// STYLES
// ========================================

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    color: "#0f172a",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    height: "76px",
    padding: "0 5vw",
    background:
      "rgba(255,255,255,0.95)",
    backdropFilter: "blur(15px)",
    borderBottom:
      "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    boxSizing: "border-box",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  backButton: {
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    border:
      "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#334155",
    fontSize: "21px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  roomAvatar: {
    width: "43px",
    height: "43px",
    borderRadius: "13px",
    background:
      "linear-gradient(135deg, #4f46e5, #06b6d4)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "900",
    boxShadow:
      "0 8px 20px rgba(79,70,229,0.2)",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    fontSize: "18px",
    lineHeight: 1.2,
    letterSpacing: "-0.4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "400px",
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "4px",
  },

  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    display: "inline-block",
  },

  onlineText: {
    color: "#16a34a",
    fontSize: "11px",
    fontWeight: "700",
  },

  offlineText: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  memberBadge: {
    padding: "8px 11px",
    background: "#f1f5f9",
    borderRadius: "9px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
  },

  desktopBackButton: {
    border: "none",
    background: "#0f172a",
    color: "white",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  // ========================================
  // CHAT WRAPPER
  // ========================================

  chatWrapper: {
    width: "min(1050px, calc(100% - 32px))",
    margin: "24px auto",
  },

  chatContainer: {
    height:
      "calc(100vh - 124px)",
    minHeight: "500px",
    background: "white",
    border:
      "1px solid #e2e8f0",
    borderRadius: "22px",
    boxShadow:
      "0 20px 60px rgba(15,23,42,0.08)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  // ========================================
  // MESSAGES
  // ========================================

  messagesContainer: {
    flex: 1,
    padding: "24px 28px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    background:
      "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  },

  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    margin: "5px 0",
  },

  senderAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#e0e7ff",
    color: "#4338ca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
    fontWeight: "900",
    flexShrink: 0,
  },

  message: {
    maxWidth: "68%",
    padding: "10px 13px 8px",
    borderRadius: "16px",
    wordBreak: "break-word",
    boxSizing: "border-box",
  },

  myMessage: {
    background:
      "linear-gradient(135deg, #4f46e5, #4338ca)",
    color: "white",
    borderBottomRightRadius: "5px",
    boxShadow:
      "0 5px 15px rgba(79,70,229,0.16)",
  },

  otherMessage: {
    background: "white",
    color: "#1e293b",
    border:
      "1px solid #e2e8f0",
    borderBottomLeftRadius: "5px",
    boxShadow:
      "0 4px 12px rgba(15,23,42,0.04)",
  },

  senderName: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#4f46e5",
    marginBottom: "5px",
  },

  messageContent: {
    fontSize: "14px",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },

  messageMeta: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginTop: "5px",
    fontSize: "9px",
    opacity: 0.68,
  },

  seenStatus: {
    fontWeight: "800",
  },

  // ========================================
  // DATE
  // ========================================

  dateSeparator: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "18px 0 10px",
  },

  dateLabel: {
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#6366f1",
    fontSize: "10px",
    fontWeight: "800",
    border:
      "1px solid #e0e7ff",
  },

  // ========================================
  // EMPTY / LOADING
  // ========================================

  centerState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  loadingCircle: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    marginBottom: "12px",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #eef2ff, #cffafe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "14px",
  },

  stateTitle: {
    margin: 0,
    color: "#334155",
    fontSize: "15px",
    fontWeight: "800",
  },

  stateText: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  // ========================================
  // TYPING
  // ========================================

  typingContainer: {
    minHeight: "34px",
    padding:
      "0 25px 7px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "white",
  },

  typingBubble: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    padding: "7px 9px",
    background: "#f1f5f9",
    borderRadius: "999px",
  },

  typingDot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#64748b",
    display: "inline-block",
  },

  typingText: {
    color: "#64748b",
    fontSize: "11px",
    fontStyle: "italic",
  },

  // ========================================
  // ERROR
  // ========================================

  error: {
    margin:
      "0 22px 8px",
    padding: "9px 12px",
    borderRadius: "9px",
    background: "#fef2f2",
    border:
      "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "11px",
  },

  // ========================================
  // MESSAGE FORM
  // ========================================

  messageForm: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding:
      "14px 18px 6px",
    borderTop:
      "1px solid #e2e8f0",
    background: "white",
  },

  messageInput: {
    flex: 1,
    minWidth: 0,
    padding: "13px 15px",
    border:
      "1px solid #dbe3ee",
    borderRadius: "13px",
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },

  sendButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    borderRadius: "13px",
    padding: "13px 16px",
    background:
      "linear-gradient(135deg, #4f46e5, #4338ca)",
    color: "white",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
      "0 7px 18px rgba(79,70,229,0.2)",
  },

  sendArrow: {
    fontSize: "17px",
    lineHeight: 1,
  },

  inputHint: {
    padding:
      "0 20px 10px",
    background: "white",
    color: "#cbd5e1",
    fontSize: "9px",
    textAlign: "right",
  },
};

export default Room;