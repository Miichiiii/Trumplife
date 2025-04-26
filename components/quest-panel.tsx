"use client"

import { CheckCircle, Circle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuestPanelProps {
  quests: any[]
  onClaim: (questId: number) => void
}

export default function QuestPanel({ quests, onClaim }: QuestPanelProps) {
  return (
    <Card className="border-2 border-red-200">
      <CardHeader className="bg-red-50">
        <CardTitle className="text-red-600">Campaign Quests</CardTitle>
        <CardDescription>Complete tasks to earn donations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-4">
        {quests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No active quests</p>
        ) : (
          quests.map((quest) => (
            <Card key={quest.id} className="border border-blue-200">
              <CardHeader className="py-3 bg-blue-50">
                <CardTitle className="text-sm flex items-center">
                  {quest.completed ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 mr-2 text-muted-foreground" />
                  )}
                  {quest.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-xs text-muted-foreground">
                  Reward: <span className="text-green-600">${quest.reward} donations</span>
                </p>
              </CardContent>
              <CardFooter className="pt-0 pb-3">
                <Button
                  size="sm"
                  className="w-full bg-red-500 hover:bg-red-600"
                  disabled={!quest.completed}
                  onClick={() => onClaim(quest.id)}
                  variant={quest.completed ? "default" : "outline"}
                >
                  {quest.completed ? "Claim Reward" : "In Progress"}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
