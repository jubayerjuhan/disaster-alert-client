import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, AlertCircle, List } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import client from "@/lib/client";
import moment from "moment";

export interface Disaster {
  _id?: string;
  type: string;
  name: string;
  location: string;
  date: string;
  severity: string;
  status: string;
  details: string;
}

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h2 className="text-xl font-bold">Admin Panel</h2>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)]">
        <nav className="space-y-2 p-2">
          <SidebarLink
            icon={<AlertCircle className="h-4 w-4" />}
            label="Send Alert"
            collapsed={collapsed}
            link={"/admin/send-alert"}
          />
          <SidebarLink
            icon={<List className="h-4 w-4" />}
            label="Disasters"
            collapsed={collapsed}
            link={"/admin-panel"}
          />
        </nav>
      </ScrollArea>
    </div>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  link: string;
}

const SidebarLink = ({ icon, label, collapsed, link }: SidebarLinkProps) => (
  <Button
    variant="ghost"
    className={`w-full justify-start ${collapsed ? "px-2" : "px-4"}`}
    onClick={() => {
      window.open(link, "_self");
    }}
  >
    {icon}
    {!collapsed && <span className="ml-2">{label}</span>}
  </Button>
);

const AdminDisasterList = () => {
  const [disasters, setDisasters] = useState<Disaster[] | null>(null);
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "severe":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  React.useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const { data } = await client("/disasters/recent-upcoming");
        setDisasters(data.disasters);
      } catch (error) {
        console.error("Error fetching disasters:", error);
      }
    };

    fetchDisasters();
  }, []);

  const handleDeleteDisaster = async (id: string) => {
    try {
      await client.delete(`/admin/disasters/${id}`);
      setDisasters(
        (prevDisasters) =>
          prevDisasters?.filter((disaster) => disaster._id !== id) || null
      );
    } catch (error) {
      console.error("Error deleting disaster:", error);
    }
  };

  const handleEditDisaster = (disaster: Disaster) => {
    setSelectedDisaster(disaster);
    setIsDialogOpen(true);
  };

  const handleAddDisaster = () => {
    setSelectedDisaster({
      type: "",
      location: "",
      date: "",
      severity: "low",
      status: "",
      name: "",
      details: "",
    });
    setIsDialogOpen(true);
  };

  const handleUpdateDisaster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisaster) return;

    try {
      if (selectedDisaster._id) {
        await client.put(
          `/admin/disasters/${selectedDisaster._id}`,
          selectedDisaster
        );
      } else {
        await client.post(`/admin/disasters`, selectedDisaster);
      }

      setIsDialogOpen(false);
      const { data } = await client("/disasters/recent-upcoming");
      setDisasters(data.disasters);
    } catch (error) {
      console.error("Error updating or adding disaster:", error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Disaster List</h3>
      </div>
      <Button variant="outline" className="mb-4" onClick={handleAddDisaster}>
        Add Disaster
      </Button>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disasters?.map((disaster, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{disaster.type}</TableCell>
                <TableCell>{disaster.location}</TableCell>
                <TableCell>
                  {moment(disaster.date).format("MMMM Do, YYYY")}
                </TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(disaster.severity)}>
                    {disaster.severity}
                  </Badge>
                </TableCell>
                <TableCell>{disaster.status}</TableCell>
                <TableCell>
                  <Button
                    variant={"outline"}
                    onClick={() => handleEditDisaster(disaster)}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant={"outline"}
                    onClick={() => handleDeleteDisaster(disaster._id!)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedDisaster && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedDisaster._id ? "Edit Disaster" : "Add Disaster"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateDisaster} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={selectedDisaster.type}
                  onChange={(e) =>
                    setSelectedDisaster({
                      ...selectedDisaster,
                      type: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={selectedDisaster.name}
                  onChange={(e) =>
                    setSelectedDisaster({
                      ...selectedDisaster,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={selectedDisaster.location}
                  onChange={(e) =>
                    setSelectedDisaster({
                      ...selectedDisaster,
                      location: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={moment(selectedDisaster.date).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setSelectedDisaster({
                      ...selectedDisaster,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <select
                  id="severity"
                  value={selectedDisaster.severity}
                  onChange={(e) =>
                    setSelectedDisaster({
                      ...selectedDisaster,
                      severity: e.target.value,
                    })
                  }
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={selectedDisaster.status}
                  onChange={(e) =>
                    setSelectedDisaster({
                      ...selectedDisaster,
                      status: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">Details</Label>
                <textarea
                  id="details"
                  value={selectedDisaster.details}
                  onChange={(e) =>
                    setSelectedDisaster({
                      ...selectedDisaster,
                      details: e.target.value,
                    })
                  }
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <Button type="submit" variant="outline">
                {selectedDisaster._id ? "Update Disaster" : "Add Disaster"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default function AdminSendAlert() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main className="flex-1 overflow-auto p-8">
        <AdminDisasterList />
      </main>
    </div>
  );
}
