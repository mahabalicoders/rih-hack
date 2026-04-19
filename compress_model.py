import pickle
import joblib
import os

input_file = 'backend/siliconmind.pkl'
output_file = 'huggingface/siliconmind.pkl'

print(f"Reading {input_file}...")
with open(input_file, 'rb') as f:
    model = pickle.load(f)

print(f"Compressing model to {output_file}...")
# compress=3 is a good balance between speed and size
joblib.dump(model, output_file, compress=3)

original_size = os.path.getsize(input_file) / (1024*1024)
compressed_size = os.path.getsize(output_file) / (1024*1024)

print(f"✅ Success!")
print(f"Original Size: {original_size:.2f} MB")
print(f"Compressed Size: {compressed_size:.2f} MB")
