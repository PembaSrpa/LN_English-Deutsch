import subprocess
import sys

def run(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.stdout:
        print(result.stdout.strip())
    if result.stderr:
        print(result.stderr.strip())
    if result.returncode != 0:
        sys.exit(result.returncode)

message = sys.argv[1] if len(sys.argv) > 1 else 'update'

run('git add .')
run(f'git commit -m "{message}"')
run('git push origin main')
