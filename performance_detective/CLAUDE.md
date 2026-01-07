# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

This is an educational exercise repository for learning performance optimization through hands-on practice. It contains **intentionally inefficient** Python functions in `src/data_processor.py` that demonstrate common performance bottlenecks (O(n²) algorithms, inefficient data structures, unnecessary repeated computations).

**IMPORTANT**: Some functions may still be inefficient by design. Before optimizing, check if the function has already been optimized by looking at its docstring and implementation.

## Development Environment

### Virtual Environment Setup
```bash
# Create virtual environment (if not exists)
python3 -m venv venv

# Install dependencies using the venv
venv/bin/pip install -r requirements.txt
```

**Note**: This system requires using the virtual environment due to externally-managed Python packages. Always prefix commands with `venv/bin/`.

## Testing Commands

### Run All Tests
```bash
venv/bin/pytest src/test_performance.py -v
```

### Run Performance Benchmarks Only
```bash
venv/bin/pytest src/test_performance.py --benchmark-only
```

### Run Specific Function Benchmarks
```bash
# Benchmark only find_duplicates
venv/bin/pytest src/test_performance.py -k "find_duplicates" --benchmark-only

# Benchmark only calculate_statistics
venv/bin/pytest src/test_performance.py -k "calculate_statistics" --benchmark-only

# Benchmark only filter_and_transform
venv/bin/pytest src/test_performance.py -k "filter_and_transform" --benchmark-only
```

### Run Correctness Tests Only
```bash
venv/bin/pytest src/test_performance.py::TestCorrectness -v
```

### Run Single Test
```bash
venv/bin/pytest src/test_performance.py::TestCorrectness::test_find_duplicates_correctness -v
```

## Code Architecture

### Core Module: `src/data_processor.py`
Contains four functions designed to demonstrate performance optimization opportunities:

1. **`find_duplicates(items)`** - Finds duplicate items in a list
   - **Status**: ✓ OPTIMIZED - O(n) using set-based hash lookup
   - Previous baseline: 1,264 ms for 10K items → Now: 0.73 ms (1,728× speedup)

2. **`calculate_statistics(data)`** - Calculates mean, median, and mode
   - **Status**: ⚠️ NEEDS OPTIMIZATION - O(n²) due to `.count()` in loop for mode calculation
   - Optimization target: O(n) using single-pass counting with dictionary/Counter

3. **`filter_and_transform(data, threshold)`** - Filters and transforms data
   - **Status**: ⚠️ NEEDS OPTIMIZATION - O(n·m) with inefficient string concatenation
   - Optimization target: O(n) using list joins or more efficient string operations

4. **`process_large_dataset(data, operations)`** - Combines all three functions
   - **Status**: Partially optimized (benefits from `find_duplicates` optimization)
   - Performance depends on the functions it calls

### Test Module: `src/test_performance.py`
Uses pytest-benchmark to measure performance at three scales:
- **Small**: 100 items
- **Medium**: 1,000 items
- **Large**: 10,000 items

Each function has both **benchmark tests** (measure performance) and **correctness tests** (verify output).

## Optimization Workflow

When optimizing a function:

1. **Establish baseline**: Run benchmarks before making changes
2. **Analyze complexity**: Identify the algorithmic bottleneck (nested loops, repeated operations, inefficient data structures)
3. **Implement optimization**: Replace inefficient patterns with better algorithms/data structures
4. **Verify correctness**: Run correctness tests to ensure behavior unchanged
5. **Measure improvement**: Run benchmarks and compare to baseline
6. **Update docstring**: Change docstring to reflect the optimization made

## Common Performance Patterns

- **Nested loops** → Use hash-based lookups (sets/dicts) for O(1) membership testing
- **Repeated `.count()` in loop** → Build frequency dictionary in single pass
- **String concatenation in loop** → Use list + `''.join()` or string builder pattern
- **List membership testing** → Convert to set for O(1) instead of O(n) lookups

## Benchmark Interpretation

pytest-benchmark output shows:
- **Min/Max/Mean**: Execution time statistics
- **StdDev**: Consistency of measurements (lower is better)
- **OPS**: Operations per second (higher is better)
- **Outliers**: Measurements that deviate from normal distribution

Look for **exponential growth** in time as dataset size increases (100→1K→10K). This indicates O(n²) or worse complexity that needs optimization.
