import "./index.css"; // Updated path to fix missing file error
import React, { useState } from "react";

// Basic Test Cases (Commented for reference)
// 1. Landing page should render first (entered = false)
// 2. Clicking "Enter App" should display friends list
// 3. Adding a friend should append to the list
// 4. Selecting a friend should display split bill form
// 5. Splitting a bill should update balances correctly

const initialFriends = [
    {
        id: 118836,
        name: "clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
];

function Button({ children, onClick }) {
    return (
        <button className="button" onClick={onClick}>
            {children}
        </button>
    );
}

// NEW Landing Page Component
// function LandingPage({ onEnter }) {
//     return (
//         <div style={{ textAlign: "center", padding: "4rem" }}>
//             <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>Welcome</h1>
//             <p style={{ fontSize: "1.6rem", marginBottom: "2rem" }}>
//                 Manage your friends and split bills easily.
//             </p>
//             <Button onClick={onEnter}>Enter App</Button>
//         </div>
//     );
// }

function LandingPage({ onEnter }) {
    return (
        <div className="landing-page">
            <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>Welcome</h1>

            <p style={{ fontSize: "1.6rem", marginBottom: "2rem" }}>
                Manage your friends and split bills easily.
            </p>

            <Button onClick={onEnter}>Enter App</Button>
        </div>
    );
}


export default function App() {
    const [friends, setFriends] = useState(initialFriends);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    // Landing page state
    const [entered, setEntered] = useState(false);

    function handleShowAddFriend() {
        setShowAddFriend((show) => !show);
    }

    function handleAddFriend(friend) {
        setFriends((friends) => [...friends, friend]);
        setShowAddFriend(false);
    }

    function handleSelection(friend) {
        setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
        setShowAddFriend(false);
    }

    function handleSplitBill(value) {
        setFriends((friends) =>
            friends.map((friend) =>
                friend.id === selectedFriend.id
                    ? { ...friend, balance: friend.balance + value }
                    : friend
            )
        );

        setSelectedFriend(null);
    }

    // Show landing page first
    if (!entered) return <LandingPage onEnter={() => setEntered(true)} />;

    return (
        <div className="app">
            <div className="sidebar">
                <FriendsList
                    friends={friends}
                    selectedFriend={selectedFriend}
                    onSelection={handleSelection}
                />

                {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

                <Button onClick={handleShowAddFriend}>
                    {showAddFriend ? "close" : "Add friend"}
                </Button>
            </div>

            {selectedFriend && (
                <FormSplitBill
                    selectedFriend={selectedFriend}
                    onSplitBill={handleSplitBill}
                />
            )}
        </div>
    );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
    return (
        <ul>
            {friends.map((friend) => (
                <Friend
                    friend={friend}
                    key={friend.id}
                    selectedFriend={selectedFriend}
                    onSelection={onSelection}
                />
            ))}
        </ul>
    );
}

function Friend({ friend, onSelection, selectedFriend }) {
    const isSelected = selectedFriend?.id === friend.id;

    return (
        <li className={isSelected ? "selected" : ""}>
            <img src={friend.image} alt={friend.name} />
            <h3>{friend.name}</h3>

            {friend.balance < 0 && (
                <p className="red">you owe {friend.name} ${Math.abs(friend.balance)}</p>
            )}
            {friend.balance > 0 && (
                <p className="green">{friend.name} owes you ${Math.abs(friend.balance)}</p>
            )}
            {friend.balance === 0 && <p>You and {friend.name} are even</p>}

            <Button onClick={() => onSelection(friend)}>
                {isSelected ? "close" : "select"}
            </Button>
        </li>
    );
}

function FormAddFriend({ onAddFriend }) {
    const [name, setName] = useState("");
    const [image, setImage] = useState("https://i.pravatar.cc/48");

    function handleSubmit(e) {
        e.preventDefault();

        if (!name || !image) return;

        const id = crypto.randomUUID();
        const newFriend = {
            id,
            name,
            image: `${image}?=${id}`,
            balance: 0,
        };

        onAddFriend(newFriend);

        setName("");
        setImage("https://i.pravatar.cc/48");
    }

    return (
        <form className="form-add-friend" onSubmit={handleSubmit}>
            <label> Friends name </label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label> Image URL </label>
            <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />

            <Button> Add </Button>
        </form>
    );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
    const [bill, setBill] = useState("");
    const [paidByUser, setPaidByUser] = useState("");
    const paidByFriend = bill ? bill - paidByUser : "";
    const [whoIsPaying, setWhoIsPaying] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        if (!bill || !paidByUser) return;
        onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
    }

    return (
        <form className="form-split-bill" onSubmit={handleSubmit}>
            <h2> Split a Bill with {selectedFriend.name} </h2>

            <label> Bill value </label>
            <input
                type="text"
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
            />

            <label> Your expenses </label>
            <input
                type="text"
                value={paidByUser}
                onChange={(e) =>
                    setPaidByUser(
                        Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
                    )
                }
            />

            <label> {selectedFriend.name}'s expenses </label>
            <input type="text" disabled value={paidByFriend} />

            <label> who is paying the bill </label>
            <select
                value={whoIsPaying}
                onChange={(e) => setWhoIsPaying(e.target.value)}
            >
                <option value="user">You</option>
                <option value="friend">{selectedFriend.name}</option>
            </select>
            <Button> Split bill </Button>
        </form>
    );
}
