import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {BookOpen} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import LoginForm from "./sign-in-form";
import {RegisterForm} from "@/app/(main)/(auth)/authorize/components/sign-up-form";

export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-100 to-amber-200">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
                        <BookOpen className="mr-2" />
                        Book Wiki
                    </CardTitle>
                    <CardDescription className="text-center">
                        Your gateway to the world of books
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <LoginForm />
                        </TabsContent>
                        <TabsContent value="register">
                            <RegisterForm />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}