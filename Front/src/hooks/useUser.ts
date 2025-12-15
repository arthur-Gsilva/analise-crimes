"use client";

import { useEffect, useState } from "react";

interface AuthUser {
  id: string;
  email: string;
  admin: boolean;
}

export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/me");

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    }

    load();
  }, []);

  return { user, loading };
}
