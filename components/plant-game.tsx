"use client"

import { useState, useEffect } from "react"
import { Sun, Sprout } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PlantDisplay from "@/components/plant-display"
import UpgradeShop from "@/components/upgrade-shop"
import QuestPanel from "@/components/quest-panel"
import { useToast } from "@/hooks/use-toast"

// Game constants
const CLICK_BASE_VALUE = 1
const AUTO_CLICK_INTERVAL = 1000 // ms

export default function PlantGame() {
  const { toast } = useToast()
  const [energy, setEnergy] = useState(0)
  const [totalEnergyEarned, setTotalEnergyEarned] = useState(0)
  const [clickValue, setClickValue] = useState(CLICK_BASE_VALUE)
  const [autoClickValue, setAutoClickValue] = useState(0)
  const [plantLevel, setPlantLevel] = useState(1)
  const [nextLevelThreshold, setNextLevelThreshold] = useState(100)
  const [evolutionProgress, setEvolutionProgress] = useState(0)

  // Upgrades state
  const [upgrades, setUpgrades] = useState({
    leaves: { level: 1, cost: 10, multiplier: 1.1 },
    stem: { level: 1, cost: 25, multiplier: 1.2 },
    roots: { level: 1, cost: 50, multiplier: 1.5 },
    flowers: { level: 0, cost: 200, multiplier: 2.0, unlocked: false },
  })

  // Quests state
  const [quests, setQuests] = useState([
    { id: 1, title: "Reach 50 energy", reward: 20, completed: false, target: 50, type: "energy" },
    { id: 2, title: "Upgrade leaves to level 3", reward: 30, completed: false, target: 3, type: "leaves" },
    { id: 3, title: "Reach plant level 2", reward: 50, completed: false, target: 2, type: "level" },
  ])

  // Auto-click effect
  useEffect(() => {
    if (autoClickValue > 0) {
      const interval = setInterval(() => {
        addEnergy(autoClickValue)
      }, AUTO_CLICK_INTERVAL)

      return () => clearInterval(interval)
    }
  }, [autoClickValue])

  // Check for level up and quest completion
  useEffect(() => {
    // Check for level up
    if (totalEnergyEarned >= nextLevelThreshold) {
      const newLevel = plantLevel + 1
      setPlantLevel(newLevel)
      setNextLevelThreshold(Math.floor(nextLevelThreshold * 2.5))

      // Unlock flowers at level 3
      if (newLevel === 3 && !upgrades.flowers.unlocked) {
        setUpgrades((prev) => ({
          ...prev,
          flowers: { ...prev.flowers, unlocked: true },
        }))

        toast({
          title: "New upgrade unlocked!",
          description: "Flowers are now available in the shop!",
          variant: "default",
        })
      }

      toast({
        title: "Level Up!",
        description: `Your plant has grown to level ${newLevel}!`,
        variant: "default",
      })
    }

    // Update evolution progress
    setEvolutionProgress(Math.min(100, Math.floor((totalEnergyEarned / nextLevelThreshold) * 100)))
  }, [totalEnergyEarned, nextLevelThreshold, plantLevel, upgrades.flowers.unlocked, toast])

  // Separate useEffect for quest checking to avoid circular dependencies
  useEffect(() => {
    // Check quests
    const updatedQuests = quests.map((quest) => {
      if (quest.completed) return quest

      let completed = false

      switch (quest.type) {
        case "energy":
          completed = totalEnergyEarned >= quest.target
          break
        case "leaves":
          completed = upgrades.leaves.level >= quest.target
          break
        case "level":
          completed = plantLevel >= quest.target
          break
      }

      if (completed && !quest.completed) {
        toast({
          title: "Quest Completed!",
          description: `${quest.title} - Reward: ${quest.reward} energy`,
          variant: "default",
        })

        // Add reward
        setEnergy((prev) => prev + quest.reward)
        setTotalEnergyEarned((prev) => prev + quest.reward)
      }

      return { ...quest, completed }
    })

    if (JSON.stringify(updatedQuests) !== JSON.stringify(quests)) {
      setQuests(updatedQuests)
    }
  }, [totalEnergyEarned, plantLevel, upgrades.leaves.level, quests, toast])

  // Handle plant click
  const handlePlantClick = () => {
    addEnergy(clickValue)
  }

  // Add energy helper
  const addEnergy = (amount) => {
    setEnergy((prev) => prev + amount)
    setTotalEnergyEarned((prev) => prev + amount)
  }

  // Purchase upgrade
  const purchaseUpgrade = (type) => {
    const upgrade = upgrades[type]

    if (energy >= upgrade.cost) {
      // Deduct cost
      setEnergy((prev) => prev - upgrade.cost)

      // Update upgrade
      const newLevel = upgrade.level + 1
      const newCost = Math.floor(upgrade.cost * 1.8)

      setUpgrades((prev) => ({
        ...prev,
        [type]: { ...prev[type], level: newLevel, cost: newCost },
      }))

      // Update click value based on upgrades
      if (type === "leaves") {
        setClickValue(CLICK_BASE_VALUE * Math.pow(upgrade.multiplier, newLevel))
      } else if (type === "stem") {
        setAutoClickValue((prev) => prev + 1)
      } else if (type === "roots") {
        // Roots increase both click and auto-click values
        setClickValue((prev) => prev * 1.1)
        setAutoClickValue((prev) => prev * 1.1)
      } else if (type === "flowers") {
        // Flowers provide a significant boost to all values
        setClickValue((prev) => prev * 1.5)
        setAutoClickValue((prev) => prev * 1.5)
      }

      toast({
        title: "Upgrade Purchased!",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} upgraded to level ${newLevel}`,
        variant: "default",
      })
    } else {
      toast({
        title: "Not enough energy!",
        description: `You need ${upgrade.cost - energy} more energy`,
        variant: "destructive",
      })
    }
  }

  // Claim quest reward
  const claimQuestReward = (questId) => {
    const quest = quests.find((q) => q.id === questId)

    if (quest && quest.completed) {
      // Mark as claimed by removing from list
      setQuests((prev) => prev.filter((q) => q.id !== questId))

      // Generate a new quest to replace it
      const newQuestId = Math.max(...quests.map((q) => q.id)) + 1
      const newQuestTypes = ["energy", "leaves", "level"]
      const newQuestType = newQuestTypes[Math.floor(Math.random() * newQuestTypes.length)]

      let newTarget = 0
      let newReward = 0

      switch (newQuestType) {
        case "energy":
          newTarget = Math.floor(totalEnergyEarned * 1.5)
          newReward = Math.floor(newTarget * 0.4)
          break
        case "leaves":
          newTarget = upgrades.leaves.level + 2
          newReward = newTarget * 15
          break
        case "level":
          newTarget = plantLevel + 1
          newReward = newTarget * 50
          break
      }

      const newQuest = {
        id: newQuestId,
        title: `${newQuestType === "energy" ? "Reach" : newQuestType === "leaves" ? "Upgrade leaves to" : "Reach plant"} ${newQuestType === "level" ? "level" : "level"} ${newTarget}`,
        reward: newReward,
        completed: false,
        target: newTarget,
        type: newQuestType,
      }

      setQuests((prev) => [...prev, newQuest])
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left column - Plant display and click area */}
      <div className="md:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Plant (Level {plantLevel})</CardTitle>
                <CardDescription>Click to collect energy!</CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1 bg-amber-100">
                <Sun className="w-4 h-4 mr-1 text-amber-500" />
                {Math.floor(energy)}
              </Badge>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Evolution Progress</span>
                <span>{evolutionProgress}%</span>
              </div>
              <Progress value={evolutionProgress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-6">
            <div
              className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95 w-full"
              onClick={handlePlantClick}
            >
              <PlantDisplay level={plantLevel} hasFlowers={upgrades.flowers.level > 0} />
              {/* Visuelles Feedback beim Klicken */}
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
                <span className="sr-only">Klicken, um Energie zu sammeln</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center">
                <Sun className="w-4 h-4 mr-1 text-amber-500" />
                <span>+{clickValue.toFixed(1)} per click</span>
              </div>
              {autoClickValue > 0 && (
                <div className="flex items-center mt-1">
                  <Sprout className="w-4 h-4 mr-1 text-green-500" />
                  <span>+{autoClickValue.toFixed(1)} per second</span>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total energy collected: {Math.floor(totalEnergyEarned)}</div>
          </CardFooter>
        </Card>
      </div>

      {/* Right column - Upgrades and quests */}
      <div>
        <Tabs defaultValue="upgrades" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
            <TabsTrigger value="quests">Quests</TabsTrigger>
          </TabsList>
          <TabsContent value="upgrades" className="mt-0">
            <UpgradeShop upgrades={upgrades} energy={energy} onPurchase={purchaseUpgrade} />
          </TabsContent>
          <TabsContent value="quests" className="mt-0">
            <QuestPanel quests={quests} onClaim={claimQuestReward} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
