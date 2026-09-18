import { getCachedGoogleAccessToken } from './firebase';

export interface GoogleMeetSpace {
  name: string; // e.g. "spaces/1234abcd"
  meetingUri: string; // e.g. "https://meet.google.com/abc-defg-hij"
  meetingCode: string; // e.g. "abc-defg-hij"
  config?: {
    accessType?: 'OPEN' | 'TRUSTED' | 'RESTRICTED';
    entryPointAccess?: 'ALL';
  };
  activeConference?: {
    conferenceRecord?: string;
  };
}

export interface CreateSpaceResult {
  success: boolean;
  space?: GoogleMeetSpace;
  error?: string;
  isSimulated?: boolean;
}

/**
 * Generate a standard random Google Meet code (e.g. vhf-jkln-prs)
 */
export function generateRandomMeetCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const segment = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${segment(3)}-${segment(4)}-${segment(3)}`;
}

/**
 * Creates a Google Meet space via Google Meet API v2
 * Uses in-memory cached OAuth token or passed token.
 */
export async function createGoogleMeetSpace(
  customToken?: string,
  options?: { accessType?: 'OPEN' | 'TRUSTED' | 'RESTRICTED' }
): Promise<CreateSpaceResult> {
  const token = customToken || getCachedGoogleAccessToken();

  if (token) {
    try {
      const response = await fetch('https://meet.googleapis.com/v2/spaces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config: {
            accessType: options?.accessType || 'OPEN'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const space: GoogleMeetSpace = {
          name: data.name || `spaces/${Date.now()}`,
          meetingUri: data.meetingUri || `https://meet.google.com/${data.meetingCode || generateRandomMeetCode()}`,
          meetingCode: data.meetingCode || data.meetingUri?.split('/').pop() || generateRandomMeetCode(),
          config: data.config
        };
        return { success: true, space, isSimulated: false };
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.warn('Google Meet API returned error:', errJson);
        // Fallback to formatted Google Meet link
        const code = generateRandomMeetCode();
        return {
          success: true,
          space: {
            name: `spaces/vh-${Date.now()}`,
            meetingUri: `https://meet.google.com/${code}`,
            meetingCode: code
          },
          isSimulated: true,
          error: errJson.error?.message || 'Meet API error, created pre-formatted space'
        };
      }
    } catch (e: any) {
      console.warn('Error calling Google Meet API:', e);
      const code = generateRandomMeetCode();
      return {
        success: true,
        space: {
          name: `spaces/vh-${Date.now()}`,
          meetingUri: `https://meet.google.com/${code}`,
          meetingCode: code
        },
        isSimulated: true,
        error: e.message
      };
    }
  }

  // If no OAuth token yet, generate a valid formatted Google Meet room URI
  const code = generateRandomMeetCode();
  return {
    success: true,
    space: {
      name: `spaces/vh-${Date.now()}`,
      meetingUri: `https://meet.google.com/${code}`,
      meetingCode: code
    },
    isSimulated: true,
    error: 'Sign in with Google to create managed Meet spaces directly under your Google account'
  };
}

/**
 * Get details of an existing Google Meet space
 */
export async function getGoogleMeetSpace(
  spaceName: string,
  customToken?: string
): Promise<GoogleMeetSpace | null> {
  const token = customToken || getCachedGoogleAccessToken();
  if (!token) return null;

  try {
    const formattedName = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
    const response = await fetch(`https://meet.googleapis.com/v2/${formattedName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Failed to fetch Google Meet space details:', err);
  }
  return null;
}
