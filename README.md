# EncryptionBuddy

EncryptionBuddy is a proof-of-concept application that provides end-to-end encrypted chat functionality using Telegram groups as a broadcast. The system uses client-side AES-GCM encryption to ensure message security while leveraging Telegram's infrastructure for message delivery.

## Features

- Client-side AES-256-GCM encryption
- Real-time message broadcasting via WebSocket
- Integration with Telegram group chats
- Secure password-based key derivation (PBKDF2)
- Encrypted message persistence through Telegram
- Simple web interface for sending/receiving messages

## Prerequisites

- Node.js and npm installed
- A Telegram Bot Token
- A Telegram Group
- Modern web browser with WebCrypto API support

## Setup

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install express ws body-parser axios
    ```

3. Configure your Telegram Bot:
   - Create a new bot through [@BotFather](https://t.me/botfather)
   - Save the provided bot token
   - Add your bot to a Telegram group

4. Get your Telegram Group ID:
   a. Add your bot to the target group
   b. Send a message to the group mentioning your bot (e.g., `@YourBot /start`)
   c. Access the following URL (replace `<YourBOTToken>`):
      ```
      https://api.telegram.org/bot<YourBOTToken>/getUpdates
      ```
   d. Find the `chat.id` value in the response JSON

5. Update `server.js` with your credentials:
    ```javascript
    const botToken = 'YOUR_BOT_TOKEN'; // Example could be: Gv7Vm9iTDbQ9hv8+yl9h5V03X2E/qEZz/Bcz47yxh7g=
    const chatId = 'YOUR_GROUP_CHAT_ID';
    ```

6. Start the server:
    ```bash
    node server.js
    ```

7. Access the application at `http://localhost:3000`

## Security Considerations

- Messages are encrypted using AES-256-GCM with unique IVs for each message
- Key derivation uses PBKDF2 with 100,000 iterations
- All encryption/decryption happens client-side
- The server never sees decrypted message content
- Encrypted messages are stored in Telegram's infrastructure
- Users must share the same password out-of-band to communicate

## Technical Details

### Encryption Process
1. Password is used with PBKDF2 to derive an AES-256 key
2. Each message uses a unique random IV
3. Message is encrypted using AES-GCM
4. Encrypted data, IV, and salt are combined and base64 encoded
5. Final encrypted message is sent to the server

### Message Format
The encrypted message format is:
base64(encryptedData|IV|salt)


### WebSocket Communication
- Real-time updates using WebSocket protocol
- Messages are broadcast to all connected clients
- Supports multiple simultaneous users

## Limitations

- Requires sharing of encryption password through secure channels
- No perfect forward secrecy
- No user authentication beyond username
- Proof of concept - not recommended for production use
- No message persistence in the web interface

## License

This project is for educational purposes only. Use at your own risk.

## Contributing

This is a proof of concept. While contributions are welcome, please note this is not intended for important information.
