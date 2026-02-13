import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Plus,
  Edit,
  Trash2,
  Percent,
  AlertTriangle,
  BedDouble,
  Users,
  X,
  Calendar,
} from "lucide-react";
import { useAdminStore } from "../../stores";
import Loading from "../../components/Loading";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/AlertDialog";

const ManageRooms = () => {
  const { rooms, isLoading, fetchRooms, deleteRoom, updateDiscount } =
    useAdminStore();
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [discountForm, setDiscountForm] = useState({
    isActive: false,
    percentage: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleDelete = async () => {
    if (!roomToDelete) return;

    const result = await deleteRoom(roomToDelete._id);

    if (result.success) {
      toast.success("Room deleted successfully");
      fetchRooms();
    } else {
      toast.error(result.message);
    }
    setRoomToDelete(null);
  };

  const openDiscountModal = (room) => {
    setSelectedRoom(room);
    setDiscountForm({
      isActive: room.seasonalDiscount?.isActive || false,
      percentage: room.seasonalDiscount?.percentage || 0,
      startDate: room.seasonalDiscount?.startDate
        ? format(new Date(room.seasonalDiscount.startDate), "yyyy-MM-dd")
        : "",
      endDate: room.seasonalDiscount?.endDate
        ? format(new Date(room.seasonalDiscount.endDate), "yyyy-MM-dd")
        : "",
    });
    setShowDiscountModal(true);
  };

  const handleDiscountSubmit = async (e) => {
    e.preventDefault();

    const result = await updateDiscount(selectedRoom._id, discountForm);

    if (result.success) {
      toast.success("Discount updated successfully");
      setShowDiscountModal(false);
      fetchRooms();
    } else {
      toast.error(result.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const categoryLabels = {
    "surf-room": "Surf Room",
    villa: "Villa",
    beachfront: "Beachfront",
    dorm: "Dorm",
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-charcoal">
            Manage Rooms
          </h1>
          <p className="text-gray-500">
            Create, edit, and manage your room inventory
          </p>
        </div>
        <NavLink
          to="/owner/rooms/new"
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Room
        </NavLink>
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className="card p-12 text-center">
          <BedDouble className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-heading font-bold text-charcoal mb-2">
            No rooms yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by adding your first room to the system.
          </p>
          <NavLink to="/owner/rooms/new" className="btn btn-primary">
            Add First Room
          </NavLink>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room._id} className="card overflow-hidden">
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={
                    room.images?.[0] ||
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400"
                  }
                  alt={room.name}
                  className="w-full h-full object-cover"
                />

                {/* Status Badge */}
                <div
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                    room.isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {room.isActive ? "Active" : "Inactive"}
                </div>

                {/* Discount Badge */}
                {room.seasonalDiscount?.isActive && (
                  <div className="absolute top-3 right-3 bg-sunset text-white px-3 py-1 rounded-full text-xs font-medium">
                    {room.seasonalDiscount.percentage}% OFF
                  </div>
                )}

                {/* Price */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-3 py-2 rounded-lg">
                  <span className="font-heading font-bold text-ocean">
                    {formatPrice(room.pricePerNight)}
                  </span>
                  <span className="text-xs text-gray-500">/night</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-charcoal mb-1">
                      {room.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {categoryLabels[room.category]}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" />
                    {room.totalRooms} rooms
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {room.maxGuests} guests
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <NavLink
                    to={`/owner/rooms/edit/${room._id}`}
                    className="flex-1 btn btn-outline btn-sm flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </NavLink>
                  <button
                    onClick={() => openDiscountModal(room)}
                    className="btn btn-sm bg-sunny/10 text-sunny-dark hover:bg-sunny/20 flex items-center gap-1"
                    title="Manage Discount"
                  >
                    <Percent className="w-4 h-4" />
                  </button>
                  <AlertDialog
                    open={roomToDelete?._id === room._id}
                    onOpenChange={(open) => !open && setRoomToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={() => setRoomToDelete(room)}
                        className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <div className="mx-auto sm:mx-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <AlertDialogTitle>Delete Room</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <strong>"{room.name}"</strong>? This action cannot be
                          undone. All associated data will be permanently
                          removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Yes, Delete Room
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-bold text-charcoal">
                Manage Discount
              </h3>
              <button
                onClick={() => setShowDiscountModal(false)}
                className="p-2 hover:bg-sand rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-500 mb-6">
              Set a seasonal discount for <strong>{selectedRoom?.name}</strong>
            </p>

            <form onSubmit={handleDiscountSubmit} className="space-y-4">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between p-4 bg-sand rounded-xl">
                <span className="font-medium">Enable Discount</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={discountForm.isActive}
                    onChange={(e) =>
                      setDiscountForm({
                        ...discountForm,
                        isActive: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ocean"></div>
                </label>
              </div>

              {/* Percentage */}
              <div>
                <label className="label flex items-center gap-2">
                  <Percent className="w-4 h-4 text-ocean" />
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={discountForm.percentage}
                  onChange={(e) =>
                    setDiscountForm({
                      ...discountForm,
                      percentage: parseInt(e.target.value),
                    })
                  }
                  min="0"
                  max="100"
                  className="input"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-ocean" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={discountForm.startDate}
                    onChange={(e) =>
                      setDiscountForm({
                        ...discountForm,
                        startDate: e.target.value,
                      })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="label flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-ocean" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={discountForm.endDate}
                    onChange={(e) =>
                      setDiscountForm({
                        ...discountForm,
                        endDate: e.target.value,
                      })
                    }
                    className="input"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDiscountModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn btn-primary">
                  Save Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
