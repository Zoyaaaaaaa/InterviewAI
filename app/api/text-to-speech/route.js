// app/api/text-to-speech/route.js
export async function POST(request) {
  try {
    const { text, voiceId } = await request.json();

    // Validate input
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return new Response(JSON.stringify({ error: 'Valid text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check API key
    const apiKey = process.env.MURF_API_KEY;
    if (!apiKey) {
      console.error('MURF_API_KEY not found in environment variables');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Voice ID mapping - Map common voice names to actual Murf API voice IDs
    const voiceIdMap = {
      'aura-orpheus-en': 'en-US-terrell',
      'aura-luna-en': 'en-US-natalie',
      'aura-stella-en': 'en-US-ariana',
      'aura-athena-en': 'en-US-amara',
      'aura-hera-en': 'en-US-phoebe',
      'aura-orion-en': 'en-US-miles',
      'aura-arcas-en': 'en-US-marcus',
      'aura-perseus-en': 'en-US-ryan',
      'aura-angus-en': 'en-US-charles',
      'aura-helios-en': 'en-US-daniel',
      // Add more mappings as needed
      'orpheus': 'en-US-terrell',
      'luna': 'en-US-natalie',
      'stella': 'en-US-ariana',
      'athena': 'en-US-amara',
    };

    // Use mapped voice ID or default
    const mappedVoiceId = voiceIdMap[voiceId] || voiceId || "en-US-terrell";

    // Prepare request data with minimal required fields
    const requestData = {
      text: text.trim(),
      voiceId: mappedVoiceId
    };

    console.log('Calling Murf API with:', requestData);
    console.log('Original voiceId:', voiceId, '→ Mapped voiceId:', mappedVoiceId);

    // Make the API call
    const response = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(requestData),
    });

    const responseText = await response.text();
    console.log('Murf API Response Status:', response.status);
    console.log('Murf API Response:', responseText.substring(0, 200) + '...');

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      
      console.error('Murf API Error:', errorData);
      return new Response(JSON.stringify({
        error: errorData.message || errorData.error || 'TTS service error'
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse response
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error('Invalid JSON response from Murf API');
      return new Response(JSON.stringify({ error: 'Invalid response from TTS service' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check for audio data
    if (!responseData.audioFile) {
      console.error('No audioFile in response:', responseData);
      return new Response(JSON.stringify({ error: 'No audio data received' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Handle both URL and base64 responses
    if (responseData.audioFile.startsWith('http')) {
      // Audio file is a URL - fetch it and return the audio data
      console.log('Fetching audio from URL:', responseData.audioFile.substring(0, 100) + '...');
      
      try {
        const audioResponse = await fetch(responseData.audioFile);
        if (!audioResponse.ok) {
          throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
        }
        
        const audioBuffer = await audioResponse.arrayBuffer();
        
        return new Response(audioBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/wav',
            'Content-Length': audioBuffer.byteLength.toString(),
          },
        });
      } catch (error) {
        console.error('Failed to fetch audio from URL:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch audio data' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      // Audio file is base64 encoded
      let audioBuffer;
      try {
        audioBuffer = Buffer.from(responseData.audioFile, 'base64');
      } catch (error) {
        console.error('Failed to decode audio data:', error);
        return new Response(JSON.stringify({ error: 'Failed to process audio data' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Return audio
      return new Response(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.length.toString(),
        },
      });
    }

  } catch (error) {
    console.error('Handler error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle unsupported methods
export async function GET() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}