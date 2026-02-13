import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { useRoomsStore } from "../stores";
import RoomCard from "../components/RoomCard";
import Loading from "../components/Loading";

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { rooms, isLoading, filters, setFilters, clearFilters, fetchRooms } =
    useRoomsStore();

  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get("category") || "",
    guests: searchParams.get("guests") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    search: searchParams.get("search") || "",
  });

  const categories = [
    { value: "", label: "All Categories" },
    { value: "beachfront", label: "Beachfront" },
    { value: "villa", label: "Villas" },
    { value: "surf-room", label: "Surf Rooms" },
    { value: "dorm", label: "Dorms" },
  ];

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    fetchRooms(params);
  }, [searchParams, fetchRooms]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();

    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      category: "",
      guests: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    });
    setSearchParams({});
    clearFilters();
  };

  const hasActiveFilters = Object.values(localFilters).some((v) => v !== "");

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-ocean overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean to-ocean-light opacity-80" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Our Accommodations
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            From luxurious beachfront villas to cozy surf rooms, find your
            perfect paradise.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-card p-4 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={localFilters.search}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, search: e.target.value })
                  }
                  className="input pl-12"
                />
              </div>

              {/* Category Select */}
              <div className="md:w-48">
                <select
                  value={localFilters.category}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      category: e.target.value,
                    })
                  }
                  className="input"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Toggle Button (Mobile) */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden btn btn-outline flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Guests"
                  value={localFilters.guests}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, guests: e.target.value })
                  }
                  className="input w-24"
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Min ₱"
                  value={localFilters.minPrice}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      minPrice: e.target.value,
                    })
                  }
                  className="input w-24"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max ₱"
                  value={localFilters.maxPrice}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      maxPrice: e.target.value,
                    })
                  }
                  className="input w-24"
                  min="0"
                />
              </div>

              {/* Search Button */}
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="md:hidden mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Guests"
                  value={localFilters.guests}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, guests: e.target.value })
                  }
                  className="input"
                  min="1"
                />
                <div></div>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={localFilters.minPrice}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      minPrice: e.target.value,
                    })
                  }
                  className="input"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={localFilters.maxPrice}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      maxPrice: e.target.value,
                    })
                  }
                  className="input"
                  min="0"
                />
              </div>
            )}
          </form>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>

              {localFilters.category && (
                <span className="badge badge-ocean">
                  {
                    categories.find((c) => c.value === localFilters.category)
                      ?.label
                  }
                </span>
              )}
              {localFilters.guests && (
                <span className="badge badge-ocean">
                  {localFilters.guests}+ guests
                </span>
              )}
              {localFilters.minPrice && (
                <span className="badge badge-ocean">
                  Min ₱{localFilters.minPrice}
                </span>
              )}
              {localFilters.maxPrice && (
                <span className="badge badge-ocean">
                  Max ₱{localFilters.maxPrice}
                </span>
              )}
              {localFilters.search && (
                <span className="badge badge-ocean">
                  "{localFilters.search}"
                </span>
              )}

              <button
                onClick={handleClearFilters}
                className="text-sm text-sunset hover:text-sunset-dark flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <Loading />
        ) : rooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sand flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-heading font-bold text-charcoal mb-2">
              No rooms found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search criteria.
            </p>
            <button onClick={handleClearFilters} className="btn btn-outline">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-charcoal">
                  {rooms.length}
                </span>{" "}
                rooms
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Rooms;
