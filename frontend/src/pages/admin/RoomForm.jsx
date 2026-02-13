import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Image as ImageIcon,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAdminStore } from "../../stores";
import Loading from "../../components/Loading";

const RoomForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, fetchRooms, createRoom, updateRoom, isLoading } =
    useAdminStore();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    pricePerNight: "",
    category: "surf-room",
    maxGuests: 2,
    totalRooms: 1,
    images: [],
    amenities: [],
    isActive: true,
  });

  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchRooms();
    }
  }, [isEdit, fetchRooms]);

  useEffect(() => {
    if (isEdit && rooms.length > 0) {
      const room = rooms.find((r) => r._id === id);
      if (room) {
        setFormData({
          name: room.name || "",
          description: room.description || "",
          shortDescription: room.shortDescription || "",
          pricePerNight: room.pricePerNight || "",
          category: room.category || "surf-room",
          maxGuests: room.maxGuests || 2,
          totalRooms: room.totalRooms || 1,
          images: room.images || [],
          amenities: room.amenities || [],
          isActive: room.isActive !== false,
        });
      }
    }
  }, [isEdit, rooms, id]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.pricePerNight || formData.pricePerNight <= 0) {
      newErrors.pricePerNight = "Valid price is required";
    }
    if (formData.maxGuests < 1) {
      newErrors.maxGuests = "At least 1 guest required";
    }
    if (formData.totalRooms < 1) {
      newErrors.totalRooms = "At least 1 room required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setSubmitting(true);

    const submitData = {
      ...formData,
      pricePerNight: parseFloat(formData.pricePerNight),
    };

    let result;
    if (isEdit) {
      result = await updateRoom(id, submitData);
    } else {
      result = await createRoom(submitData);
    }

    setSubmitting(false);

    if (result.success) {
      toast.success(
        isEdit ? "Room updated successfully" : "Room created successfully",
      );
      navigate("/owner/rooms");
    } else {
      toast.error(result.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const categoryOptions = [
    { value: "surf-room", label: "Surf Room" },
    { value: "villa", label: "Villa" },
    { value: "beachfront", label: "Beachfront" },
    { value: "dorm", label: "Dorm" },
  ];

  const commonAmenities = [
    "Free WiFi",
    "Air Conditioning",
    "Ocean View",
    "Private Bathroom",
    "Surfboard Storage",
    "Beach Access",
    "Room Service",
    "Mini Bar",
    "Flat Screen TV",
    "Coffee Maker",
    "Safe Box",
    "Balcony",
    "King Bed",
    "Twin Beds",
    "Kitchen",
    "Pool Access",
  ];

  if (isEdit && isLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/owner/rooms")}
          className="p-2 hover:bg-sand rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-charcoal">
            {isEdit ? "Edit Room" : "Add New Room"}
          </h1>
          <p className="text-gray-500">
            {isEdit
              ? "Update room details below"
              : "Fill in the details to create a new room"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="text-lg font-heading font-bold mb-4">
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Room Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Ocean Breeze Suite"
                className={`input ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Price Per Night (₱) *</label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="149.99"
                className={`input ${errors.pricePerNight ? "border-red-500" : ""}`}
              />
              {errors.pricePerNight && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pricePerNight}
                </p>
              )}
            </div>

            <div>
              <label className="label">Max Guests *</label>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                min="1"
                max="20"
                className={`input ${errors.maxGuests ? "border-red-500" : ""}`}
              />
              {errors.maxGuests && (
                <p className="text-red-500 text-sm mt-1">{errors.maxGuests}</p>
              )}
            </div>

            <div>
              <label className="label">Total Rooms Available *</label>
              <input
                type="number"
                name="totalRooms"
                value={formData.totalRooms}
                onChange={handleChange}
                min="1"
                max="100"
                className={`input ${errors.totalRooms ? "border-red-500" : ""}`}
              />
              {errors.totalRooms && (
                <p className="text-red-500 text-sm mt-1">{errors.totalRooms}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="label">Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="A brief one-line description for cards"
                maxLength={150}
                className="input"
              />
              <p className="text-sm text-gray-400 mt-1">
                {formData.shortDescription.length}/150 characters
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="label">Full Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Detailed description of the room, its features, and what makes it special..."
                className={`input ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <h2 className="text-lg font-heading font-bold mb-4">Room Images</h2>

          <div className="space-y-4">
            {/* Image URL Input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Enter image URL (https://...)"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={addImage}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview Grid */}
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Room image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=200";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-ocean text-white text-xs px-2 py-1 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No images added yet</p>
                <p className="text-sm text-gray-400">Add image URLs above</p>
              </div>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="card p-6">
          <h2 className="text-lg font-heading font-bold mb-4">Amenities</h2>

          <div className="space-y-4">
            {/* Custom Amenity Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAmenity())
                }
                placeholder="Add custom amenity"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Add Common Amenities */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {commonAmenities
                  .filter((a) => !formData.amenities.includes(a))
                  .slice(0, 8)
                  .map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          amenities: [...prev.amenities, amenity],
                        }))
                      }
                      className="px-3 py-1.5 bg-sand text-charcoal text-sm rounded-full hover:bg-sunny/20 transition-colors"
                    >
                      + {amenity}
                    </button>
                  ))}
              </div>
            </div>

            {/* Selected Amenities */}
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-ocean/10 text-ocean rounded-full"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="hover:text-sunset"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-bold">Room Status</h2>
              <p className="text-gray-500">
                Control whether this room is visible to guests
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-ocean"></div>
              <span className="ml-3 font-medium">
                {formData.isActive ? "Active" : "Inactive"}
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/owner/rooms")}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEdit ? "Update Room" : "Create Room"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
