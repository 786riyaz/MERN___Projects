import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
}

interface Props {
  users: User[];
  onSelect: (user: User) => void;
}

const UserSelect = ({ users, onSelect }: Props) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: "relative" }}>
      <input
        placeholder="Assign to user..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            maxHeight: 150,
            overflowY: "auto",
            border: "1px solid #ccc",
            background: "#fff",
            zIndex: 10
          }}
        >
          {filtered.length === 0 && (
            <div style={{ padding: 8 }}>No users found</div>
          )}

          {filtered.map(user => (
            <div
              key={user._id}
              style={{ padding: 8, cursor: "pointer" }}
              onClick={() => {
                onSelect(user);
                setSearch(user.username);
                setOpen(false);
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
