import client from "@/lib/client";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Info,
  MapPin,
  Phone,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DisasterDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // This would be passed as a prop or fetched based on the disaster ID
  // const disaster = {
  //   type: "Hurricane",
  //   name: "Hurricane Zephyr",
  //   location: "Miami, Florida",
  //   date: "2024-09-22",
  //   severity: "Severe",
  //   status: "Approaching",
  //   description:
  //     "Hurricane Zephyr is a Category 4 hurricane approaching the southern coast of Florida. It is expected to make landfall within the next 24 hours, bringing strong winds, heavy rainfall, and potential storm surges.",
  //
  //
  // };
  const safetyMeasure = [
    "Evacuate if you are in a designated evacuation zone",
    "Secure loose outdoor items",
    "Prepare an emergency kit with food, water, and medications",
    "Stay informed through local news and weather updates",
  ];
  const emergencyContacts = [
    { name: "National Emergency Helpline", phone: "999" },
  ];

  const [disaster, setDisaster] = useState<any>(null);

  useEffect(() => {
    const fetchDisaster = async () => {
      try {
        const { data } = await client(`/disasters/${id}`);
        setDisaster(data);
      } catch (error) {
        console.error("Error fetching disaster details:", error);
      }
    };

    fetchDisaster();
  }, [id]);

  if (!disaster) {
    return <div>Loading...</div>;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h1 className="text-3xl font-bold">{disaster.name}</h1>
            <p className="text-blue-100 flex items-center mt-2">
              <AlertTriangle className="mr-2" />
              {disaster.type}
            </p>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Key Information */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <MapPin className="text-gray-400 mr-2" />
                <span>{disaster.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="text-gray-400 mr-2" />
                <span>{moment(disaster.date).format("MMMM Do, YYYY")}</span>
              </div>
              <div className="flex items-center">
                <Info className="text-gray-400 mr-2" />
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold ${getSeverityColor(
                    disaster?.severity
                  )}`}
                >
                  {disaster?.severity}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="text-gray-400 mr-2" />
                <span>{disaster?.status}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{disaster.details}</p>
            </div>

            {/* Latest Updates */}

            {/* Safety Measures */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Safety Measures</h2>
              <ul className="list-disc list-inside text-gray-600">
                {safetyMeasure.map((measure: string, index) => (
                  <li key={index}>{measure}</li>
                ))}
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Emergency Contacts</h2>
              <div className="space-y-2">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="font-medium">{contact.name}</span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Phone className="mr-1" />
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterDetailPage;
