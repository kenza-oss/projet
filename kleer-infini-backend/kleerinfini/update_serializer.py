import os

file_path = r'c:\Users\DELL\Desktop\dev\kleer-infini-backend\kleerinfini\products\serializers.py'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Replace raw_name with name and handle the check
    if 'raw_name = obj.image.name' in line:
        new_lines.append(line.replace('raw_name = obj.image.name', 'name = obj.image.name'))
    elif 'if raw_name.startswith(' in line:
        new_lines.append(line.replace('if raw_name.startswith(', 'if name and name.startswith('))
    elif 'return raw_name' in line:
        new_lines.append(line.replace('return raw_name', 'return name'))
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Serializer updated successfully.")
