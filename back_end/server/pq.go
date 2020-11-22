package main

// Priority Queue for matches. NOTE: not thread safe.
// Pop, Push should be protected by a Mutex.

type PriorityQueue []*Match

func (pq PriorityQueue) Len() int { return len(pq) }

func (pq PriorityQueue) Less(i, j int) bool {
	return pq[i].Priority < pq[j].Priority
}

func (pq *PriorityQueue) Pop() interface{} {
	old := *pq
	item := old[len(old)-1]
	*pq = old[0:(len(old) - 1)]
	return item
}

func (pq *PriorityQueue) Push(x interface{}) {
	item := x.(*Match)
	*pq = append(*pq, item)
}

func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
}
