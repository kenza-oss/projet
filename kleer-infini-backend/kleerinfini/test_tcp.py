import socket
import sys

# Test de connectivite TCP brute
hosts_to_test = [
    ("db.cpuchjragjrkmbejsafy.supabase.co", 5432, "Direct IPv6"),
    ("aws-0-eu-central-1.pooler.supabase.com", 5432, "Pooler Session"),
    ("aws-0-eu-central-1.pooler.supabase.com", 6543, "Pooler Transaction"),
]

print("=" * 70)
print("TEST DE CONNECTIVITE TCP")
print("=" * 70)

for host, port, description in hosts_to_test:
    print(f"\n{description}")
    print(f"Host: {host}:{port}")
    print("-" * 70)
    
    try:
        # Resoudre le DNS
        print(f"Resolution DNS...")
        ip_addresses = socket.getaddrinfo(host, port, socket.AF_UNSPEC, socket.SOCK_STREAM)
        print(f"Adresses trouvees:")
        for addr in ip_addresses[:3]:
            family = "IPv6" if addr[0] == socket.AF_INET6 else "IPv4"
            print(f"  - {family}: {addr[4][0]}")
        
        # Tester la connexion TCP
        print(f"Test de connexion TCP...")
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        
        result = sock.connect_ex((host, port))
        
        if result == 0:
            print(f">>> SUCCESS! Port {port} est OUVERT <<<")
            sock.close()
        else:
            print(f"ECHEC: Port {port} est FERME (code: {result})")
            
    except socket.gaierror as e:
        print(f"ECHEC DNS: {e}")
    except socket.timeout:
        print(f"TIMEOUT: Pas de reponse apres 5 secondes")
    except Exception as e:
        print(f"ERREUR: {type(e).__name__}: {e}")

print("\n" + "=" * 70)
print("FIN DES TESTS")
print("=" * 70)
