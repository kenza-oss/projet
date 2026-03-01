import socket

project_id = "cpuchjragjrkmbejsafy"
variations = [
    f"db.{project_id}.supabase.co",
    f"{project_id}.supabase.co",
    f"db.{project_id}.supabase.com",
    f"{project_id}.supabase.com",
]

for host in variations:
    try:
        ip = socket.gethostbyname(host)
        print(f"✅ {host} -> {ip}")
    except:
        print(f"❌ {host} (failed)")
