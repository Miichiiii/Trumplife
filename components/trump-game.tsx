"use client"

import { useState, useEffect } from "react"
import { DollarSign, Twitter } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TrumpDisplay from "@/components/trump-display"
import UpgradeShop from "@/components/upgrade-shop"
import QuestPanel from "@/components/quest-panel"
import { useToast } from "@/hooks/use-toast"

// Game constants
const CLICK_BASE_VALUE = 1
const AUTO_CLICK_INTERVAL = 1000 // ms

// Trump quotes
const TRUMP_QUOTES = [
  "I love raising taxes—makes everyone equally broke!",
  "Believe me, nobody loses money like I do!",
  "My deals are so tremendous, they bankrupt entire states!",
  "Fake news can't handle these true tax hikes!",
  "We're building a bigger deficit—nobody builds deficits like me!",
  "Your wallet is shrinking—thank me later!",
  "I've got the best numbers—of people who can't pay their bills!",
  "Alternative facts say your taxes just went up!",
  "Zero accountability, 100% chaos—winning!",
  "I promise to spend like there's no tomorrow… because there won't be!",
]

export default function TrumpGame() {
  const { toast } = useToast()
  const [donations, setDonations] = useState(0)
  const [totalDonationsEarned, setTotalDonationsEarned] = useState(0)
  const [clickValue, setClickValue] = useState(CLICK_BASE_VALUE)
  const [autoClickValue, setAutoClickValue] = useState(0)
  const [trumpLevel, setTrumpLevel] = useState(1)
  const [nextLevelThreshold, setNextLevelThreshold] = useState(100)
  const [evolutionProgress, setEvolutionProgress] = useState(0)
  const [currentQuote, setCurrentQuote] = useState("")
  const [showQuote, setShowQuote] = useState(false)

  // Upgrades state
  const [upgrades, setUpgrades] = useState({
    hair: {
      level: 1,
      cost: 10,
      multiplier: 1.1,
      name: "Hair Module",
      description: "Improve Trump's hair for more attention",
    },
    socialMedia: {
      level: 1,
      cost: 25,
      multiplier: 1.2,
      name: "Social Media Boost",
      description: "Unlock Twitter bots and Instagram ads",
    },
    realEstate: {
      level: 1,
      cost: 50,
      multiplier: 1.5,
      name: "Real Estate Empire",
      description: "Buy skyscrapers and golf courses",
    },
    wallBuild: {
      level: 0,
      cost: 200,
      multiplier: 2.0,
      unlocked: false,
      name: "Wall Building",
      description: "Temporary strong multiplier",
    },
  })

  // Quests state
  const [quests, setQuests] = useState([
    { id: 1, title: "Collect 50 donations", reward: 20, completed: false, target: 50, type: "donations" },
    { id: 2, title: "Upgrade hair to level 3", reward: 30, completed: false, target: 3, type: "hair" },
    { id: 3, title: "Reach Trump level 2", reward: 50, completed: false, target: 2, type: "level" },
  ])

  // Auto-click effect
  useEffect(() => {
    if (autoClickValue > 0) {
      const interval = setInterval(() => {
        addDonations(autoClickValue)
      }, AUTO_CLICK_INTERVAL)

      return () => clearInterval(interval)
    }
  }, [autoClickValue])

  // Check for level up and quest completion
  useEffect(() => {
    // Check for level up
    if (totalDonationsEarned >= nextLevelThreshold) {
      const newLevel = trumpLevel + 1
      setTrumpLevel(newLevel)
      setNextLevelThreshold(Math.floor(nextLevelThreshold * 2.5))

      // Unlock wall building at level 3
      if (newLevel === 3 && !upgrades.wallBuild.unlocked) {
        setUpgrades((prev) => ({
          ...prev,
          wallBuild: { ...prev.wallBuild, unlocked: true },
        }))

        toast({
          title: "New upgrade unlocked!",
          description: "Wall Building is now available in the shop!",
          variant: "default",
        })
      }

      let levelTitle = "Reality TV Star"
      if (newLevel === 2) levelTitle = "Presidential Candidate"
      if (newLevel >= 3) levelTitle = "47th US President"

      toast({
        title: "Level Up!",
        description: `Trump has evolved to ${levelTitle}!`,
        variant: "default",
      })
    }

    // Update evolution progress
    setEvolutionProgress(Math.min(100, Math.floor((totalDonationsEarned / nextLevelThreshold) * 100)))
  }, [totalDonationsEarned, nextLevelThreshold, trumpLevel, upgrades.wallBuild.unlocked, toast])

  // Separate useEffect for quest checking to avoid circular dependencies
  useEffect(() => {
    // Check quests
    const updatedQuests = quests.map((quest) => {
      if (quest.completed) return quest

      let completed = false

      switch (quest.type) {
        case "donations":
          completed = totalDonationsEarned >= quest.target
          break
        case "hair":
          completed = upgrades.hair.level >= quest.target
          break
        case "level":
          completed = trumpLevel >= quest.target
          break
      }

      if (completed && !quest.completed) {
        toast({
          title: "Quest Completed!",
          description: `${quest.title} - Reward: $${quest.reward}`,
          variant: "default",
        })

        // Add reward
        setDonations((prev) => prev + quest.reward)
        setTotalDonationsEarned((prev) => prev + quest.reward)
      }

      return { ...quest, completed }
    })

    if (JSON.stringify(updatedQuests) !== JSON.stringify(quests)) {
      setQuests(updatedQuests)
    }
  }, [totalDonationsEarned, trumpLevel, upgrades.hair.level, quests, toast])

  // Handle Trump click
  const handleTrumpClick = () => {
    // Get random Trump quote
    const randomQuote = TRUMP_QUOTES[Math.floor(Math.random() * TRUMP_QUOTES.length)]
    setCurrentQuote(randomQuote)
    setShowQuote(true)

    // Hide quote after 2 seconds
    setTimeout(() => {
      setShowQuote(false)
    }, 2000)

    // Add donations
    addDonations(clickValue)

    // Play sound (if implemented)
    // playSound('click')
  }

  // Add donations helper
  const addDonations = (amount) => {
    setDonations((prev) => prev + amount)
    setTotalDonationsEarned((prev) => prev + amount)
  }

  // Purchase upgrade
  const purchaseUpgrade = (type) => {
    const upgrade = upgrades[type]

    if (donations >= upgrade.cost) {
      // Deduct cost
      setDonations((prev) => prev - upgrade.cost)

      // Update upgrade
      const newLevel = upgrade.level + 1
      const newCost = Math.floor(upgrade.cost * 1.8)

      setUpgrades((prev) => ({
        ...prev,
        [type]: { ...prev[type], level: newLevel, cost: newCost },
      }))

      // Update click value based on upgrades
      if (type === "hair") {
        setClickValue(CLICK_BASE_VALUE * Math.pow(upgrade.multiplier, newLevel))
      } else if (type === "socialMedia") {
        setAutoClickValue((prev) => prev + 1)
      } else if (type === "realEstate") {
        // Real estate increases both click and auto-click values
        setClickValue((prev) => prev * 1.1)
        setAutoClickValue((prev) => prev * 1.1)
      } else if (type === "wallBuild") {
        // Wall building provides a significant temporary boost
        setClickValue((prev) => prev * 1.5)

        // After 30 seconds, reduce the boost
        setTimeout(() => {
          setClickValue((prev) => prev / 1.5)
          toast({
            title: "Wall Building Boost Ended",
            description: "The temporary boost has expired",
            variant: "default",
          })
        }, 30000)
      }

      toast({
        title: "Upgrade Purchased!",
        description: `${upgrade.name} upgraded to level ${newLevel}`,
        variant: "default",
      })
    } else {
      toast({
        title: "Not enough donations!",
        description: `You need $${upgrade.cost - donations} more`,
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
      const newQuestTypes = ["donations", "hair", "level"]
      const newQuestType = newQuestTypes[Math.floor(Math.random() * newQuestTypes.length)]

      let newTarget = 0
      let newReward = 0

      switch (newQuestType) {
        case "donations":
          newTarget = Math.floor(totalDonationsEarned * 1.5)
          newReward = Math.floor(newTarget * 0.4)
          break
        case "hair":
          newTarget = upgrades.hair.level + 2
          newReward = newTarget * 15
          break
        case "level":
          newTarget = trumpLevel + 1
          newReward = newTarget * 50
          break
      }

      const newQuest = {
        id: newQuestId,
        title: `${newQuestType === "donations" ? "Collect" : newQuestType === "hair" ? "Upgrade hair to" : "Reach Trump"} ${newQuestType === "level" ? "level" : "level"} ${newTarget}`,
        reward: newReward,
        completed: false,
        target: newTarget,
        type: newQuestType,
      }

      setQuests((prev) => [...prev, newQuest])
    }
  }

  // Get Trump level title
  const getTrumpLevelTitle = () => {
    switch (trumpLevel) {
      case 1:
        return "Reality TV Star"
      case 2:
        return "Presidential Candidate"
      default:
        return "47th US President"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left column - Trump display and click area */}
      <div className="md:col-span-2">
        <Card className="h-full bg-gradient-to-b from-blue-50 to-red-50 border-2 border-blue-200">
          <CardHeader className="bg-blue-100 border-b border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-red-600">Trump ({getTrumpLevelTitle()})</CardTitle>
                <CardDescription>Click to collect donations!</CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1 bg-green-100 text-green-800 border-green-300">
                <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                {Math.floor(donations)}
              </Badge>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Campaign Progress</span>
                <span>{evolutionProgress}%</span>
              </div>
              <Progress value={evolutionProgress} className="h-2 bg-blue-200" indicatorClassName="bg-red-500" />
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-6 relative">
            <div
              className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95 w-full"
              onClick={handleTrumpClick}
            >
              <TrumpDisplay level={trumpLevel} hasWall={upgrades.wallBuild.level > 0} />

              {/* Quote bubble */}
              {showQuote && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white p-3 rounded-xl shadow-lg border-2 border-blue-300 max-w-xs z-20">
                  <div className="text-sm font-bold text-center">{currentQuote}</div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r-2 border-b-2 border-blue-300"></div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-blue-100 border-t border-blue-200">
            <div className="text-sm text-blue-800">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                <span>+{clickValue.toFixed(1)} per click</span>
              </div>
              {autoClickValue > 0 && (
                <div className="flex items-center mt-1">
                  <Twitter className="w-4 h-4 mr-1 text-blue-500" />
                  <span>+{autoClickValue.toFixed(1)} per second</span>
                </div>
              )}
            </div>
            <div className="text-sm text-blue-800">Total donations: ${Math.floor(totalDonationsEarned)}</div>
          </CardFooter>
        </Card>
      </div>

      {/* Right column - Upgrades and quests */}
      <div>
        <Tabs defaultValue="upgrades" className="h-full">
          <TabsList className="grid w-full grid-cols-2 bg-blue-100">
            <TabsTrigger value="upgrades" className="data-[state=active]:bg-red-100">
              Upgrades
            </TabsTrigger>
            <TabsTrigger value="quests" className="data-[state=active]:bg-red-100">
              Quests
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upgrades" className="mt-0">
            <UpgradeShop upgrades={upgrades} currency={donations} onPurchase={purchaseUpgrade} />
          </TabsContent>
          <TabsContent value="quests" className="mt-0">
            <QuestPanel quests={quests} onClaim={claimQuestReward} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
