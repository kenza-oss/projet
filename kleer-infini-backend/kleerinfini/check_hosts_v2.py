import socket

project_id = "cpuchjragjrkmbejsafy"
region = "aws-0-eu-central-1"
variations = [
    f"db.{project_id}.supabase.co",
    f"{project_id}.supabase.co",
    f"db.{project_id}.{region}.supabase.co",
    f"{project_id}.{region}.supabase.co",
    f"{project_id}.supabase.com",
    f"db.{project_id}.supabase.com",
]

for host in variations:
    try:
        ip = socket.gethostbyname(host)
        print(f"OK: {host} -> {ip}")
    except:
        print(f"FAIL: {host}")
