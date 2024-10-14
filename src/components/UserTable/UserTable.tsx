import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import client from "@/lib/client";
import toast from "react-hot-toast";

import "./UserTable.css";

// Define the User type
type User = {
  _id: string;
  name: string;
  email: string;
};

const defaultTemplate = `
      <h1>Disaster Alert</h1>
      <p>Dear User,</p>
      <p>We regret to inform you that a disaster has occurred in your area. Please take the necessary precautions and stay safe.</p>
      <p>For more information, please visit our website or contact our support team.</p>
      <p>Stay safe,</p>
      <p>Your Disaster Management Team</p>
    `;

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const contentBlock = htmlToDraft(defaultTemplate);
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  );
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState)
  );

  useEffect(() => {
    setSelectAll(selectedUsers.length === users.length);
  }, [selectedUsers, users]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await client.get("/users");
        setUsers(response.data.users);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRowSelect = (user: User) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers([...users]);
    }
    setSelectAll(!selectAll);
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      await client.post("/admin/send-alert", {
        htmlContent: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        subject: "Disaster Alert",
        users: selectedUsers,
      });
      toast.success("Email sent successfully");
      setShowModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.some((u) => u._id === user._id)}
                  onCheckedChange={() => handleRowSelect(user)}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 space-x-4">
        <Button onClick={handleSelectAll}>
          {selectAll ? "Deselect All" : "Select All"}
        </Button>
        <Button
          onClick={() => setShowModal(true)}
          disabled={selectedUsers.length === 0}
        >
          Send Email
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selected Users</DialogTitle>
            <DialogDescription>
              Please write your email content below to send a disaster alert to
              selected users
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Editor
              editorState={editorState} // Changed to editorState instead of defaultEditorState
              onEditorStateChange={setEditorState}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
            />

            <Button
              onClick={handleSendEmail}
              disabled={loading}
              variant="secondary"
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
