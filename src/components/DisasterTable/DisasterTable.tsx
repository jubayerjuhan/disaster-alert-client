import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import client from "@/lib/client";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export interface Disaster {
  _id: string;
  name: string;
  type: string;
  location: string;
  date: string;
  severity: string;
  status: string;
}

// const disasters = [
//   {
//     type: "Earthquake",
//     location: "San Francisco, CA",
//     date: "2024-09-15",
//     severity: "Moderate",
//     status: "Ongoing",
//   },
//   {
//     type: "Flood",
//     location: "New Orleans, LA",
//     date: "2024-09-20",
//     severity: "Severe",
//     status: "Warning",
//   },
//   {
//     type: "Wildfire",
//     location: "Los Angeles, CA",
//     date: "2024-09-18",
//     severity: "High",
//     status: "Contained",
//   },
//   {
//     type: "Hurricane",
//     location: "Miami, FL",
//     date: "2024-09-22",
//     severity: "Severe",
//     status: "Approaching",
//   },
//   {
//     type: "Tornado",
//     location: "Oklahoma City, OK",
//     date: "2024-09-17",
//     severity: "High",
//     status: "Past",
//   },
// ];

const DisasterTable = ({
  setSelectedDisaster,
  selectAble,
  selectedDisaster,
}: {
  setSelectedDisaster?: React.Dispatch<React.SetStateAction<Disaster>>;
  selectAble?: boolean;
  selectedDisaster?: Disaster;
}) => {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState<Disaster[] | null>(null);

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

  console.log(disasters);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Detail</TableHead>
            {selectAble && <TableHead>Action</TableHead>}
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
                  onClick={() => {
                    navigate(`/disaster/${disaster._id}`);
                  }}
                >
                  Details
                </Button>
              </TableCell>
              {selectAble && setSelectedDisaster && (
                <TableCell>
                  <Button
                    className=""
                    variant={"outline"}
                    onClick={() => {
                      setSelectedDisaster(disaster);
                    }}
                  >
                    {selectedDisaster?._id === disaster._id
                      ? "Selected"
                      : "  Select This Disaster"}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DisasterTable;
