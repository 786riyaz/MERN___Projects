// client/src/components/UserSelect.tsx
import { useEffect, useRef, useState } from "react";

interface User {
  _id: string;
  username: string;
}

interface Props {
  users: User[];
  value: User | null;
  onSelect: (user: User | null) => void;
}

const UserSelect = ({ users, value, onSelect }: Props) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ======================
     SYNC WITH PARENT
  ====================== */
  useEffect(() => {
    if (value) {
      setSearch(value.username);
    } else {
      setSearch("");
    }
    setHighlightedIndex(-1);
  }, [value]);

  /* ======================
     CLICK OUTSIDE
  ====================== */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  /* ======================
     KEYBOARD HANDLER
  ====================== */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setOpen(true);
      setHighlightedIndex(0);
      return;
    }

    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(i =>
          i < filteredUsers.length - 1 ? i + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(i =>
          i > 0 ? i - 1 : filteredUsers.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const user = filteredUsers[highlightedIndex];
          onSelect(user);
          setSearch(user.username);
          setOpen(false);
          setHighlightedIndex(-1);
        }
        break;

      case "Escape":
        e.preventDefault();
        setOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="user-select" ref={wrapperRef}>
      <input
        ref={inputRef}
        placeholder="Assign to user..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        onKeyDown={handleKeyDown}
      />

      {open && (
        <div className="user-select-dropdown">
          {filteredUsers.length === 0 && (
            <div className="user-select-empty">
              No users found
            </div>
          )}

          {filteredUsers.map((user, index) => (
            <div
              key={user._id}
              className={`user-select-option ${
                index === highlightedIndex ? "active" : ""
              }`}
              onMouseEnter={() =>
                setHighlightedIndex(index)
              }
              onClick={() => {
                onSelect(user);
                setSearch(user.username);
                setOpen(false);
                setHighlightedIndex(-1);
              }}
            >
              {user.username}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSelect;
