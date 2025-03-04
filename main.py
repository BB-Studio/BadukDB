from app import app
import signal
import sys
import logging

def signal_handler(sig, frame):
    logging.info('Shutting down gracefully...')
    sys.exit(0)

if __name__ == "__main__":
    # Set up signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Start the application
    app.run(host="0.0.0.0", port=5000, debug=True)
