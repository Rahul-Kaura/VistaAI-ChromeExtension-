#!/usr/bin/env python3
"""
Create a sophisticated VistaAI logo inspired by OpenAI but unique
"""
from PIL import Image, ImageDraw, ImageFont
import os
import math

def create_vista_logo(output_path, size=128):
    """Create a simple, reliable VistaAI logo that Chrome extensions can handle"""
    # Create a simple solid background
    img = Image.new('RGB', (size, size), (66, 133, 244))  # Google Blue
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    
    # Draw a simple circle
    radius = int(size * 0.4)
    draw.ellipse([center-radius, center-radius, center+radius, center+radius], 
                fill=(255, 255, 255), outline=(0, 0, 0), width=2)
    
    # Draw a simple "V" using basic shapes
    v_size = int(size * 0.3)
    v_x = center - v_size // 2
    v_y = center - v_size // 2
    
    # Draw "V" as two triangles
    # Left triangle
    draw.polygon([(v_x, v_y), (v_x + v_size//4, v_y + v_size), (v_x + v_size//2, v_y + v_size//2)], 
                fill=(66, 133, 244))
    
    # Right triangle  
    draw.polygon([(v_x + v_size//2, v_y + v_size//2), (v_x + v_size*3//4, v_y + v_size), (v_x + v_size, v_y)], 
                fill=(66, 133, 244))
    
    # Save as PNG
    img.save(output_path, 'PNG')
    print(f"✅ VistaAI logo created at {output_path}")

def create_all_sizes():
    """Create logos in all required sizes"""
    sizes = [16, 48, 128]
    
    for size in sizes:
        filename = f"vista-ai-logo-{size}.png"
        create_vista_logo(filename, size)
    
    # Also create the main logo file
    create_vista_logo("vista-ai-logo.png", 128)
    print("✅ All VistaAI logos created successfully!")

if __name__ == "__main__":
    create_all_sizes()
