import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/auth/profile");

        setProfile(response.data);
        setName(response.data.name);
        setBio(response.data.bio || "");
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.put("/auth/profile", {
        name,
        bio
      });

      setProfile(response.data.user);
      setMessage("Profile updated successfully!");

    } catch (error) {
      setMessage("Failed to update profile");
    }
  };

  if (!profile) {
    return (
      <main className="profile-page">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="profile-page">

      <div className="profile-card">

        <div className="profile-avatar">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profile"
            />
          ) : (
            "👤"
          )}
        </div>

        <h1>{profile.name}</h1>

        <p className="profile-role">
          {profile.role}
        </p>

        <form onSubmit={handleSubmit}>

          <label>Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>

          <input
            value={profile.email}
            disabled
          />

          <label>Bio</label>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
          />

          <button type="submit">
            Save Changes
          </button>

        </form>

        {message && (
          <p className="profile-message">
            {message}
          </p>
        )}

      </div>

    </main>
  );
}

export default Profile;