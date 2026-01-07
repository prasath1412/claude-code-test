"""
Data processing module with intentionally inefficient implementations.
These functions are designed to demonstrate performance bottlenecks
that can be identified and optimized using Claude Code.
"""


def find_duplicates(items):
    """
    Find all duplicate items in a list.

    Optimized implementation: O(n) with set-based lookup
    Uses hash table for O(1) membership testing

    Args:
        items: List of items to check for duplicates

    Returns:
        List of duplicate items (each duplicate appears once)
    """
    seen = set()
    duplicates = set()

    for item in items:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)

    return list(duplicates)


def calculate_statistics(data):
    """
    Calculate mean, median, and mode from a list of numbers.

    Current implementation: Multiple O(n) passes, O(n²) for mode
    Issues:
    - Sorts data for median (O(n log n))
    - Counts occurrences inefficiently with .count() in loop (O(n²))
    - Makes multiple passes through the data

    Args:
        data: List of numeric values

    Returns:
        Dictionary with 'mean', 'median', and 'mode' keys
    """
    if not data:
        return {"mean": None, "median": None, "mode": None}

    # Calculate mean
    mean = sum(data) / len(data)

    # Calculate median - requires sorting
    sorted_data = sorted(data)
    n = len(sorted_data)
    if n % 2 == 1:
        median = sorted_data[n // 2]
    else:
        median = (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2

    # Calculate mode - extremely inefficient
    mode = None
    max_count = 0
    for num in data:
        count = data.count(num)  # O(n) operation inside O(n) loop!
        if count > max_count:
            max_count = count
            mode = num

    return {"mean": mean, "median": median, "mode": mode}


def filter_and_transform(data, threshold):
    """
    Filter data above threshold and apply transformation.

    Current implementation: O(n·m) where m is string length
    Issues:
    - String concatenation in loop creates new string each time
    - Inefficient str() conversion and character iteration

    Args:
        data: List of numeric values
        threshold: Minimum value to include

    Returns:
        List of transformed string values
    """
    result = []
    for item in data:
        if item > threshold:
            # Inefficient: Creates new string object on each concatenation
            transformed = ""
            for char in str(item):
                transformed = transformed + char.upper()
            result.append(transformed)
    return result


def process_large_dataset(data, operations):
    """
    Apply multiple operations to a dataset.

    This function combines all the inefficiencies above for
    demonstration purposes on larger datasets.

    Args:
        data: List of numeric values
        operations: List of operation names to perform

    Returns:
        Dictionary with results of each operation
    """
    results = {}

    if "duplicates" in operations:
        results["duplicates"] = find_duplicates(data)

    if "statistics" in operations:
        results["statistics"] = calculate_statistics(data)

    if "filter" in operations:
        threshold = sum(data) / len(data)  # Use mean as threshold
        results["filtered"] = filter_and_transform(data, threshold)

    return results
