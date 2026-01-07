"""Profile the find_duplicates function to identify bottlenecks."""
import time
import sys
sys.path.insert(0, 'src')
from data_processor import find_duplicates

# Test with different sizes
sizes = [100, 500, 1000, 2000, 5000, 10000]

print("=" * 60)
print("PROFILING find_duplicates()")
print("=" * 60)
print(f"{'Size':<10} {'Time (ms)':<15} {'Comparisons':<20} {'Time/Comp (ns)'}")
print("-" * 60)

for size in sizes:
    # Create data with some duplicates
    items = list(range(size // 2)) * 2  # 50% duplicates

    # Calculate expected comparisons
    comparisons = size * (size - 1) // 2

    start = time.perf_counter()
    result = find_duplicates(items)
    elapsed = time.perf_counter() - start

    time_ms = elapsed * 1000
    time_per_comp_ns = (elapsed / comparisons) * 1_000_000_000

    print(f"{size:<10} {time_ms:<15.2f} {comparisons:<20,} {time_per_comp_ns:.1f}")

print("\n" + "=" * 60)
print("BOTTLENECK DETAILS:")
print("=" * 60)
print("1. Nested loops: O(n²) - Every item compared with every other")
print("2. List lookup: 'not in duplicates' scans entire list each time")
print("3. For 10K items: ~50 MILLION comparisons!")
print("\nExpected with O(n) solution using set: ~10K operations")
print("Potential speedup: ~5000x")
