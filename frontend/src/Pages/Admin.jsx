import { Plus, Edit, Trash2 } from "lucide-react";
import { NavLink, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const adminOptions = [
  {
    id: "create",
    title: "Create Problem",
    description: "Add a new coding problem to the platform",
    icon: Plus,
    color: "bg-green-600 hover:bg-green-700",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    route: "/admin/create",
  },
  {
    id: "update",
    title: "Update Problem",
    description: "Edit existing problems and their details",
    icon: Edit,
    color: "bg-yellow-500 hover:bg-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    route: "/admin/update",
  },
  {
    id: "delete",
    title: "Delete Problem",
    description: "Remove problems from the platform",
    icon: Trash2,
    color: "bg-red-600 hover:bg-red-700",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    route: "/admin/delete",
  },
];

function Admin() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Guard: only admin can access
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-base-content">
            Admin Panel
          </h1>

          <p className="text-lg text-base-content/70">
            Manage coding problems on your platform
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {adminOptions.map((option) => {
            const Icon = option.icon;

            return (
              <div
                key={option.id}
                className="rounded-2xl bg-base-100 p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className={`mb-5 rounded-full p-4 ${option.bgColor}`}>
                    <Icon className="h-8 w-8 text-base-content" />
                  </div>

                  {/* Title */}
                  <h2 className="mb-3 text-2xl font-semibold text-base-content">
                    {option.title}
                  </h2>

                  {/* Description */}
                  <p className="mb-8 text-sm leading-6 text-base-content/70">
                    {option.description}
                  </p>

                  {/* Button */}
                  <NavLink
                    to={option.route}
                    className={`inline-flex w-full max-w-xs items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 ${option.color}`}
                  >
                    {option.title}
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;