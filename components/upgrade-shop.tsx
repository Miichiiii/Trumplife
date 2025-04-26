"use client"

import { DollarSign, Twitter, Building, Hammer } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UpgradeShopProps {
  upgrades: any
  currency: number
  onPurchase: (type: string) => void
}

export default function UpgradeShop({ upgrades, currency, onPurchase }: UpgradeShopProps) {
  const upgradeItems = [
    {
      type: "hair",
      title: upgrades.hair.name,
      description: upgrades.hair.description,
      icon: <DollarSign className="w-4 h-4" />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
    {
      type: "socialMedia",
      title: upgrades.socialMedia.name,
      description: upgrades.socialMedia.description,
      icon: <Twitter className="w-4 h-4" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      type: "realEstate",
      title: upgrades.realEstate.name,
      description: upgrades.realEstate.description,
      icon: <Building className="w-4 h-4" />,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      type: "wallBuild",
      title: upgrades.wallBuild.name,
      description: upgrades.wallBuild.description,
      icon: <Hammer className="w-4 h-4" />,
      color: "text-gray-500",
      bgColor: "bg-gray-100",
    },
  ]

  return (
    <Card className="border-2 border-red-200">
      <CardHeader className="bg-red-50">
        <CardTitle className="text-red-600">Campaign Upgrades</CardTitle>
        <CardDescription>Improve Trump's campaign</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-4">
        {upgradeItems.map((item) => {
          const upgrade = upgrades[item.type]

          // Skip if not unlocked
          if (item.type === "wallBuild" && !upgrade.unlocked) {
            return (
              <Card key={item.type} className="bg-gray-100 opacity-70 border border-gray-300">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center">
                    <div className={`p-1 rounded-full mr-2 ${item.bgColor}`}>{item.icon}</div>
                    {item.title} (Locked)
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-xs text-muted-foreground">Unlock at Trump level 3</p>
                </CardContent>
              </Card>
            )
          }

          return (
            <Card key={item.type} className="border border-blue-200">
              <CardHeader className="py-3 bg-blue-50">
                <CardTitle className="text-sm flex items-center">
                  <div className={`p-1 rounded-full mr-2 ${item.bgColor}`}>{item.icon}</div>
                  {item.title} (Level {upgrade.level})
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <p className="text-xs mt-1">Current bonus: x{Math.pow(upgrade.multiplier, upgrade.level).toFixed(2)}</p>
              </CardContent>
              <CardFooter className="pt-0 pb-3">
                <Button
                  size="sm"
                  className="w-full bg-red-500 hover:bg-red-600"
                  disabled={currency < upgrade.cost}
                  onClick={() => onPurchase(item.type)}
                >
                  Upgrade (${upgrade.cost})
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )
}
