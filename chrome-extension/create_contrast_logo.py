#!/usr/bin/env python3
"""
Create a high-contrast VistaAI logo for better toolbar visibility
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_contrast_logo(size=128):
    """Create a high-contrast logo that shows up well in Chrome toolbar"""
    # Create a bright blue background
    img = Image.new('RGB', (size, size), (25, 118, 210))  # Material Blue
    draw = ImageDraw.Draw(img)
    
    # Draw a white circle in the center
    margin = size // 6
    draw.ellipse([margin, margin, size-margin, size-margin], 
                fill=(255, 255, 255), outline=(25, 118, 210), width=4)
    
    # Draw a bold "V" using filled triangles
    center = size // 2
    v_size = size // 2.5
    
    # V shape coordinates
    left_x = center - v_size // 2
    right_x = center + v_size // 2
    top_y = center - v_size // 2
    bottom_y = center + v_size // 2
    mid_x = center
    mid_y = center + v_size // 4
    
    # Draw V as filled triangles
    # Left triangle
    draw.polygon([(left_x, top_y), (mid_x, mid_y), (left_x + v_size//4, bottom_y)], 
                fill=(25, 118, 210))
    
    # Right triangle  
    draw.polygon([(right_x - v_size//4, bottom_y), (mid_x, mid_y), (right_x, top_y)], 
                fill=(25, 118, 210))
    
    # Add a white border around the entire logo
    draw.rectangle([0, 0, size-1, size-1], outline=(255, 255, 255), width=2)
    
    return img

def create_all_contrast_logos():
    """Create all required logo sizes with high contrast"""
    sizes = [16, 48, 128]
    
    for size in sizes:
        logo = create_contrast_logo(size)
        filename = f"vista-ai-logo-{size}.png"
        logo.save(filename, 'PNG')
        print(f"✅ Created {filename}")
    
    # Also create the main logo
    logo = create_contrast_logo(128)
    logo.save("vista-ai-logo.png", 'PNG')
    print(f"✅ Created vista-ai-logo.png")

if __name__ == "__main__":
    create_all_contrast_logos()
    print("✅ All high-contrast VistaAI logos created successfully!")
