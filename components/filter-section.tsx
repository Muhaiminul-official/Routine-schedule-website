"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import type { FilterState } from "@/lib/types"

interface FilterSectionProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  onApplyFilters: () => void
  onResetFilters: () => void
}

export function FilterSection({ filters, setFilters, onApplyFilters, onResetFilters }: FilterSectionProps) {
  const [showFilters, setShowFilters] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string | boolean) => {
    setFilters({ ...filters, [key]: value })
  }

  // Generate batch options from 58th to 66th
  const batchOptions = []
  for (let i = 58; i <= 66; i++) {
    batchOptions.push(`${i}th Batch`)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search Bar - Always visible */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by title, course code, or subject..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      {showFilters && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={filters.department} onValueChange={(value) => updateFilter("department", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                  <SelectItem value="EEE">Electrical & Electronics Engineering</SelectItem>
                  <SelectItem value="BBA">Business Administration</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Select value={filters.batch} onValueChange={(value) => updateFilter("batch", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Batches">All Batches</SelectItem>
                  {batchOptions.map((batch) => (
                    <SelectItem key={batch} value={batch}>
                      {batch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select value={filters.section} onValueChange={(value) => updateFilter("section", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Sections">All Sections</SelectItem>
                  <SelectItem value="Section A">Section A</SelectItem>
                  <SelectItem value="Section B">Section B</SelectItem>
                  <SelectItem value="Section C">Section C</SelectItem>
                  <SelectItem value="Section D">Section D</SelectItem>
                  <SelectItem value="Section E">Section E</SelectItem>
                  <SelectItem value="Section F">Section F</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showOngoing"
              checked={filters.showOngoingOnly}
              onCheckedChange={(checked) => updateFilter("showOngoingOnly", checked as boolean)}
            />
            <Label htmlFor="showOngoing" className="text-sm font-medium">
              Show current ongoing classes only
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onApplyFilters} className="flex-1 bg-red-600 hover:bg-red-700">
              Show Routine
            </Button>
            <Button variant="outline" onClick={onResetFilters} className="flex-1">
              Reset Filters
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
