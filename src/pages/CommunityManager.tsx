
  {/* Add Lockers Dialog */}
  <Dialog open={showAddLockerDialog} onOpenChange={setShowAddLockerDialog}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add New Lockers</DialogTitle>
        <DialogDescription>
          Add new lockers to your community.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="systemId">Locker System</Label>
          <Select 
            value={lockerFormData.systemId.toString()}
            onValueChange={(value) => setLockerFormData(prev => ({ ...prev, systemId: parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select locker system" />
            </SelectTrigger>
            <SelectContent>
              {lockerSystems.map(system => (
                <SelectItem key={system.id} value={system.id.toString()}>
                  {system.name} ({system.location})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rows">Rows</Label>
            <Input
              id="rows"
              name="rows"
              type="number"
              min="1"
              value={lockerFormData.rows}
              onChange={handleLockerFormChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="columns">Columns</Label>
            <Input
              id="columns"
              name="columns"
              type="number"
              min="1"
              value={lockerFormData.columns}
              onChange={handleLockerFormChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Locker Size</Label>
          <Select 
            value={lockerFormData.size}
            onValueChange={(value: 'small' | 'medium' | 'large') => 
              setLockerFormData(prev => ({ ...prev, size: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm">
            This will add {lockerFormData.rows * lockerFormData.columns} {lockerFormData.size} lockers in a {lockerFormData.rows}×{lockerFormData.columns} grid.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setShowAddLockerDialog(false)}>
          Cancel
        </Button>
        <Button onClick={handleAddLockers}>
          Add {lockerFormData.rows * lockerFormData.columns} Lockers
        </Button>
      </div>
    </DialogContent>
  </Dialog>
