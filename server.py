#!/usr/bin/env python3
"""
Enhanced HTTP server for testing Hunty Zombie website locally
Features:
- Automatic port selection if default is in use
- Command line port specification
- Better error handling
- Process information for occupied ports
"""

import http.server
import socketserver
import os
import sys
import socket
import subprocess
import webbrowser
from time import sleep

# Configuration
DEFAULT_PORT = 8000
PORT_RANGE = range(8000, 8100)  # Try ports 8000-8099
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add CORS headers for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom log format with timestamp
        sys.stderr.write("%s - - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format%args))

def check_port(port):
    """Check if a port is available"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    return result != 0

def find_available_port(start_port=DEFAULT_PORT):
    """Find an available port starting from start_port"""
    if check_port(start_port):
        return start_port
    
    print(f"⚠️  Port {start_port} is already in use!")
    
    # Try to find what's using the port
    try:
        result = subprocess.run(['lsof', '-i', f':{start_port}'], 
                              capture_output=True, text=True, timeout=2)
        if result.stdout:
            print(f"💡 Process using port {start_port}:")
            lines = result.stdout.strip().split('\n')
            if len(lines) > 1:
                print(f"   {lines[1]}")
    except:
        pass
    
    print(f"🔍 Searching for available port...")
    
    for port in PORT_RANGE:
        if check_port(port):
            print(f"✅ Found available port: {port}")
            return port
    
    raise Exception("No available ports found in range 8000-8099")

def get_all_addresses():
    """Get all network addresses where the server is accessible"""
    addresses = ['localhost', '127.0.0.1']
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        if local_ip not in addresses:
            addresses.append(local_ip)
    except:
        pass
    return addresses

def start_server(port=None):
    """Start the HTTP server"""
    # Parse command line arguments
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg in ['--help', '-h']:
            print("""
📚 Hunty Zombie Local Server Help
=================================
Usage:
  python3 server.py              # Auto-select available port (8000-8099)
  python3 server.py <port>       # Use specific port number
  python3 server.py --port <port># Use specific port with flag
  python3 server.py --help       # Show this help message

Examples:
  python3 server.py              # Start on port 8000 (or next available)
  python3 server.py 8080         # Start on port 8080
  python3 server.py --port 9000  # Start on port 9000

Features:
  - Automatic port selection if default is occupied
  - CORS headers enabled for API testing
  - Color-coded console output
  - Shows all accessible URLs
            """)
            sys.exit(0)
        elif arg == '--port' and len(sys.argv) > 2:
            port = int(sys.argv[2])
        else:
            port = int(arg)
    
    # Use provided port or find an available one
    if port:
        if not check_port(port):
            print(f"❌ Error: Port {port} is already in use!")
            print(f"💡 Try: python3 server.py  (for automatic port selection)")
            sys.exit(1)
        selected_port = port
    else:
        selected_port = find_available_port()
    
    # Change to project directory
    os.chdir(DIRECTORY)
    
    # Allow socket reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", selected_port), MyHTTPRequestHandler) as httpd:
            print("\n" + "="*60)
            print("🎮 HUNTY ZOMBIE WEBSITE SERVER")
            print("="*60)
            print(f"📁 Serving: {DIRECTORY}")
            print(f"🚀 Port: {selected_port}")
            print("-"*60)
            print("📱 Access URLs:")
            
            addresses = get_all_addresses()
            for addr in addresses:
                print(f"   ➜ http://{addr}:{selected_port}/")
            
            print("-"*60)
            print("📑 Available Pages:")
            print(f"   • Home:    http://localhost:{selected_port}/")
            print(f"   • Codes:   http://localhost:{selected_port}/codes/")
            print(f"   • Wiki:    http://localhost:{selected_port}/wiki/")
            print(f"   • Guides:  http://localhost:{selected_port}/guides/")
            print(f"   • Scripts: http://localhost:{selected_port}/scripts/")
            print("-"*60)
            print("⌨️  Commands:")
            print("   • Press Ctrl+C to stop the server")
            print("   • Press Ctrl+R in browser to refresh")
            print("="*60)
            print("🟢 Server is running... Waiting for requests...")
            print()
            
            # Optional: Open browser automatically
            # Uncomment the next line to auto-open browser
            # webbrowser.open(f'http://localhost:{selected_port}/')
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n" + "="*60)
                print("🛑 Shutting down server...")
                httpd.shutdown()
                print("✅ Server stopped successfully")
                print("👋 Goodbye!")
                print("="*60)
                
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"\n❌ Error: Port {selected_port} became occupied!")
            print("💡 This might happen if:")
            print("   1. Another instance is already running")
            print("   2. The port was just released and needs time")
            print("\n🔧 Solutions:")
            print("   1. Wait a few seconds and try again")
            print("   2. Use a different port: python3 server.py 8080")
            print("   3. Kill the process using the port:")
            print(f"      lsof -ti:{selected_port} | xargs kill -9")
        else:
            print(f"\n❌ Error: {e}")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        print("💡 Try running with a different port: python3 server.py 8080")

if __name__ == "__main__":
    try:
        start_server()
    except KeyboardInterrupt:
        print("\n👋 Server startup cancelled")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Failed to start server: {e}")
        sys.exit(1)