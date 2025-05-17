
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ProfileContext = createContext({
  profile: null,
  loading: true,
  error: null,
  updateProfile: async () => {},
  refreshProfile: async () => {},
  uploading: false,
  uploadAvatar: async () => null
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        // Parse preferences to ensure it's an object
        let parsedPreferences = data.preferences || {};
        
        // If preferences is a string, try to parse it as JSON
        if (typeof data.preferences === 'string') {
          try {
            parsedPreferences = JSON.parse(data.preferences);
          } catch (e) {
            console.error('Failed to parse preferences string:', e);
            parsedPreferences = {}; // Fallback to empty object
          }
        }
        
        // If it's not an object after parsing, use empty object
        if (typeof parsedPreferences !== 'object' || parsedPreferences === null || Array.isArray(parsedPreferences)) {
          parsedPreferences = {};
        }

        setProfile({
          ...data,
          preferences: parsedPreferences
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state on success
      setProfile((prevProfile) => prevProfile ? { ...prevProfile, ...updates } : null);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error("Failed to update profile");
      throw err;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const uploadAvatar = async (file) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      setUploading(true);
      
      // Create storage bucket if it doesn't exist yet (normally would be done via migrations)
      try {
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB
        });
      } catch (error) {
        // Ignore error if bucket already exists
        if (!error.message.includes('already exists')) {
          throw error;
        }
      }

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData?.publicUrl || null;

      if (avatarUrl) {
        // Update the profile with the new avatar URL
        await updateProfile({ avatar_url: avatarUrl });
      }

      return avatarUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      toast.error("Failed to upload avatar");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      loading,
      error,
      updateProfile,
      refreshProfile,
      uploading,
      uploadAvatar
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
