import { NextResponse } from 'next/server';

export async function GET() {
  const speechKey = process.env.SPEECH_KEY;
  const speechRegion = process.env.SPEECH_REGION;

  if (!speechKey || !speechRegion) {
    console.error('Speech key or region not configured in server environment variables.');
    return NextResponse.json({ error: 'Speech key or region not configured.' }, { status: 500 });
  }

  const headers = {
    'Ocp-Apim-Subscription-Key': speechKey,
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  try {
    const tokenResponse = await fetch(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: 'POST',
      headers: headers
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Error fetching speech token from Azure:", errorText);
      return NextResponse.json({ error: `Error fetching token from Azure: ${tokenResponse.status} ${errorText}` }, { status: tokenResponse.status });
    }

    const token = await tokenResponse.text();
    return NextResponse.json({ token: token, region: speechRegion });
  } catch (err: any) {
    console.error("Exception fetching speech token:", err);
    return NextResponse.json({ error: `There was an error authorizing your speech key: ${err.message}` }, { status: 401 });
  }
}
